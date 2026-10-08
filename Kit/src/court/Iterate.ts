// Copyright AStarship <https://astarship.net>.
/**
 * CourtIterate — legal-aid document iteration. DETERMINISTIC, CREATE-ONLY.
 *
 * Why this exists (Captain directive, 2026-09-17):
 *   astar-legal-aid was doing DESTRUCTIVE edits (editing the markdown in place)
 *   to increment a failed legal filing that a clerk/judge sent back for revision.
 *   We can't trust an LLM to increment the filename, and we need observability,
 *   so we keep a per-case log of the agentic workflow — "we can't lose our
 *   progress". The Crabs Machine is contiguous, so it can pack data on the stack
 *   and pop it off agentically to undo / test trees / do A* when something
 *   didn't work. This endpoint is the deterministic increment + log.
 *
 * What it does (deterministic, NO LLM in the loop):
 *   1. takes a document location (string) under the Court root + an optional
 *      amended text,
 *   2. finds the trailing draft number and INCREMENTS it by one:
 *        ...Complaint.draft.3.md  ->  ...Complaint.draft.4.md
 *   3. WRITES A NEW FILE (creates the next revision). It NEVER overwrites,
 *      renames, moves, unlinks, or truncates the source or any existing file —
 *      only the new file is created. If the target already exists it fails.
 *   4. the new file carries YAML front matter: version (incremented), parent
 *      file hash, and iteration count.
 *   5. logs ONE NDJSON line to the case's agentic-workflow log (observability).
 *
 * THE CAP is the country's rule (TCourtRules.max_draft_revisions; default 64).
 * THE LOG NAME + CASES FOLDER are the country's rules too. The shared algorithm
 * is the skeleton; the rules are the country's impl.
 *
 * Portability: NO hardcoded home dir. The Court root is injected via
 * TCourtConfig.court_root (a Court is a folder + config, portable to any
 * machine/country). The open-source Court is for the whole world.
 *
 * The endpoint contract is served by CourtIterateHandler (HTTP layer); the
 * actual filesystem work lives here so it is unit-testable without HTTP.
 */

import { createHash } from "node:crypto"
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { homedir } from "node:os"
import path from "node:path"
import type { TCourtRules } from "./Rules"
import { FreedomCourtRules } from "./Rules"

/**
 * TCourtConfig — WHERE the court lives. This is the universal, config-injected
 * part: a Court is a folder on disk. No hardcoded home dir, no server identity.
 */
export interface TCourtConfig {
  /** Absolute path to the Court root (e.g. ~/FreedomCourt or a mounted volume). */
  court_root: string
}

/** The config the legal-aid iterate endpoint needs (root + rules). */
export interface TCourtIterateConfig {
  court_root: string
  rules?: TCourtRules
}

/** A document that failed review and needs the next draft. */
export interface TCourtFailedDocument {
  /** Path under the Court root (or absolute) to the current draft. */
  document: string
  /** The amended text (optional; if absent the current content is carried forward). */
  amended?: string
}

/** The deterministic iteration result. Record members: lower_snake_case. */
export interface TCourtIterateRecord {
  /** The incremented filename, e.g. "Complaint.draft.4.md" (the return value). */
  new_file_name: string
  /** The absolute path of the newly created file. */
  new_path: string
  /** The source document's basename. */
  source_file_name: string
  /** The source document's absolute path. */
  source_path: string
  /** The old draft number (e.g. 3). */
  old_draft: number
  /** The new draft number (e.g. 4). */
  new_draft: number
  /** The version written into the new file's front matter. */
  version: number
  /** SHA-256 of the source file's bytes (provenance / anti-destructive proof). */
  source_sha256: string
  /** The case id the document belongs to (from the path). */
  case_id: string
  /** True if a log line was appended. */
  logged: boolean
}

/**
 * The cap is a COUNTRY RULE (TCourtRules.max_draft_revisions). This constant is
 * just the Freedom Court default, re-exported for convenience.
 */
export const COURT_MAX_DRAFT_REVISIONS = FreedomCourtRules.max_draft_revisions

// The trailing ".draft.<N>.md" marker (the legal-aid iteration target).
export const COURT_DRAFT_RE = /\.draft\.(\d+)\.md$/i

/**
 * CourtIterateError — a deterministic failure from the iterate flow.
 */
export class CourtIterateError extends Error {
  readonly code: string
  constructor(code: string, message: string) {
    super(message)
    this.name = "CourtIterateError"
    this.code = code
  }
}

/**
 * CourtRoot — resolve the Court root (config-injected, universal).
 */
export function CourtRoot(cfg?: TCourtConfig | string): string {
  const explicit = typeof cfg === "string" ? cfg : cfg?.court_root
  if (explicit) return path.resolve(explicit)
  if (process.env.FREEDOM_COURT_ROOT) return path.resolve(process.env.FREEDOM_COURT_ROOT)
  const home = homedir() || process.env.HOME || ""
  if (!home) {
    throw new CourtIterateError(
      "no_court_root",
      "Court root not configured: pass TCourtConfig.court_root or set FREEDOM_COURT_ROOT",
    )
  }
  return path.join(home, "FreedomCourt")
}

/**
 * CourtResolvePath — resolve + validate a raw path against the Court root
 * (path-traversal guard).
 */
export function CourtResolvePath(root: string, raw: string): string {
  const resolved = path.isAbsolute(raw) ? path.resolve(raw) : path.resolve(root, raw)
  const under =
    resolved === root || resolved.startsWith(root.endsWith(path.sep) ? root : root + path.sep)
  if (!under) {
    throw new CourtIterateError(
      "outside_root",
      `Path escapes the court root: ${raw}`,
    )
  }
  return resolved
}

function Sha256Hex(buf: Buffer): string {
  return createHash("sha256").update(buf).digest("hex")
}

/**
 * AppendLogLine — append one NDJSON line to the case's agentic-workflow log.
 */
function AppendLogLine(
  rules: TCourtRules,
  abs_path: string,
  rec: {
    source_file_name: string
    source_path: string
    new_file_name: string
    new_path: string
    old_draft: number
    new_draft: number
    version: number
    source_sha256: string
    case_id: string
  },
): boolean {
  try {
    // The log lives with the case's own documents (same folder as the draft).
    const log_dir = path.dirname(abs_path)
    mkdirSync(log_dir, { recursive: true })
    const log_path = path.join(log_dir, rules.agent_workflow_log)
    const line =
      JSON.stringify({
        ts: new Date().toISOString(),
        event: "legal_aid_iterate",
        ...rec,
      }) + "\n"
    writeFileSync(log_path, line, { flag: "a" })
    return true
  } catch {
    return false
  }
}

/**
 * CourtIterate — the deterministic create-only increment.
 *
 * @param failed   The failed document (document path under the Court root; optional amended).
 * @param cfg      TCourtIterateConfig (court_root REQUIRED; rules default FreedomCourtRules).
 * @returns        TCourtIterateRecord
 * @throws         CourtIterateError on a deterministic failure (code + message).
 */
export function CourtIterate(
  failed: TCourtFailedDocument,
  cfg?: TCourtIterateConfig,
): TCourtIterateRecord {
  const rules = cfg?.rules ?? FreedomCourtRules
  const root = CourtRoot(cfg)
  const abs_source = CourtResolvePath(root, failed.document)

  if (!existsSync(abs_source)) {
    throw new CourtIterateError("no_source", `Source document not found: ${failed.document}`)
  }
  const st = statSync(abs_source)
  if (!st.isFile()) {
    throw new CourtIterateError("not_a_file", `Not a file: ${failed.document}`)
  }

  const base = path.basename(abs_source)
  const m = base.match(COURT_DRAFT_RE)
  if (!m) {
    throw new CourtIterateError(
      "not_a_draft",
      `Not a legal-aid draft (expected ...draft.N.md): ${base}`,
    )
  }
  const old_draft = Number(m[1])
  const new_draft = old_draft + 1

  // The cap is a COUNTRY RULE. Enforce: creating draft (cap + 1) is refused.
  const cap = rules.max_draft_revisions
  if (new_draft > cap) {
    throw new CourtIterateError(
      "cap_exceeded",
      `Draft revision ${new_draft} exceeds the cap of ${cap} (${base}). The file must be resolved manually; refusing to auto-increment beyond ${cap}.`,
    )
  }

  const dir = path.dirname(abs_source)
  const new_file_name = base.replace(COURT_DRAFT_RE, `.draft.${new_draft}.md`)
  const abs_new = path.join(dir, new_file_name)

  if (existsSync(abs_new)) {
    throw new CourtIterateError(
      "target_exists",
      `Target already exists (refusing to overwrite): ${new_file_name}`,
    )
  }

  const source_bytes = readFileSync(abs_source)
  const source_sha = Sha256Hex(source_bytes)

  const source_body = source_bytes.toString("utf8").replace(/^---\n.*?\n---\n?/s, "")
  const source_version_match = /\bversion\s*:\s*(\d+)/.exec(source_body)
  const source_iteration_match = /\biteration\s*:\s*(\d+)/.exec(source_body)
  const version = (source_version_match ? Number(source_version_match[1]) : old_draft) + 1
  const iteration = (source_iteration_match ? Number(source_iteration_match[1]) : old_draft - 1) + 1

  const amended =
    typeof failed.amended === "string" && failed.amended.length > 0
      ? failed.amended
      : source_body

  const front =
    "---\n" +
    `version: ${version}\n` +
    `iteration: ${iteration}\n` +
    `parent: ${base}\n` +
    `parent_sha256: ${source_sha}\n` +
    `created_at: ${new Date().toISOString()}\n` +
    "source: legal-aid-iterate\n" +
    "status: draft\n" +
    "---\n\n"

  mkdirSync(dir, { recursive: true })
  writeFileSync(abs_new, front + amended, "utf8")

  const case_id =
    abs_source
      .split(path.sep)
      .filter(Boolean)
      .reverse()
      .find((p) => !/\.md$/.test(p)) ?? ""

  const rec: TCourtIterateRecord = {
    new_file_name,
    new_path: abs_new,
    source_file_name: base,
    source_path: abs_source,
    old_draft,
    new_draft,
    version,
    source_sha256: source_sha,
    case_id,
    logged: false,
  }
  rec.logged = AppendLogLine(rules, abs_new, rec)

  return rec
}
