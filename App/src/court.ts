/**
 * Court toolkit wrapper — the RN-safe slice of @freelawgen/court.
 *
 * The Kit (@freelawgen/court) is the deterministic Court procedure skeleton.
 * This wrapper exposes the parts that are PURE and run inside React Native
 * (no Node `process`, no Node `crypto`):
 *
 *   - MarkdownWordCount   — deterministic word count of a pleading.
 *   - DocketFileName      — the country's docket filename grammar.
 *   - CaseFolderName      — the case folder name.
 *   - ValidateTag         — the docket tag policy.
 *   - FreedomCourtRules   — the default (Freedom Court) rules; a State can
 *                           supply its own TCourtRules.
 *   - SortFifo            — FIFO queue ordering.
 *
 * NOT used here (Node-only, run server-side on the user's own machine):
 *   - InitCaseNumberMinter / CaseNumberNew — need Node `crypto` + `process.env`.
 *     The case number is minted by the user's local server (or left as a
 *     placeholder the server fills at filing time). See README.
 *   - exportToPleadingPdf — reads/writes files; runs on the server.
 *
 * IMPORTANT (React Native): we import the Kit's PURE sub-modules directly
 * (`@freelawgen/court/rules`, `/filename`, `/word-count`) instead of the barrel
 * (`@freelawgen/court`). The barrel re-exports Node-bound modules (Iterate,
 * PleadingExporter, CaseNumber) that import `node:crypto`/`node:fs`/`docx`,
 * which don't exist in the RN runtime. The sub-paths keep the bundle RN-safe.
 */
import { DocketFileName, CaseFolderName, ValidateTag, SortFifo } from "@freelawgen/court/filename"
import { MarkdownWordCount } from "@freelawgen/court/word-count"
import { FreedomCourtRules, type TCourtRules } from "@freelawgen/court/rules"

/**
 * Deterministic word count of a pleading's Markdown. Uses the Kit's
 * MarkdownWordCount (markdown-it based) when it loads in the RN runtime, and
 * falls back to a whitespace token count if the dependency is unavailable in
 * this runtime.
 */
export function countWords(source: string): number {
  try {
    return MarkdownWordCount(source, { frontmatter: "none" }).word_count
  } catch {
    // Fallback: a word is a whitespace-delimited token with a letter/number.
    return source
      .split(/\s+/)
      .filter((t) => /[A-Za-z0-9\u00C0-\u024F]/.test(t))
      .length
  }
}

/** The docket filename for a document at a given court level + tag. */
export function docketFileName(
  date: Date,
  rules: TCourtRules,
  level: string,
  tag: string,
): string {
  return DocketFileName(date, rules, level, tag)
}

/** The case folder name for a new case. */
export function caseFolderName(
  date: Date,
  rules: TCourtRules,
  level: string,
  tag: string,
): string {
  return CaseFolderName(date, rules, level, tag)
}

/** Validate a docket tag against the level's tag policy (throws if invalid). */
export function validateTag(rules: TCourtRules, level: string, tag: string): string {
  return ValidateTag(rules, level, tag)
}

/** A queue item for FIFO ordering (the court's processing order). */
export interface TQueueItem {
  queue: string
  name: string
}

/** FIFO ordering over a queue (shadow/emergency first, oldest-first). */
export function fifoSort(items: readonly TQueueItem[]): TQueueItem[] {
  return SortFifo(items)
}

/** The default rules (the Freedom Court). A State builds its own TCourtRules. */
export const defaultRules: TCourtRules = FreedomCourtRules

/** The four Freedom Court levels, in ascending order (for the level picker). */
export const courtLevels: readonly { level: string; label: string }[] =
  FreedomCourtRules.levels.map((l) => ({ level: l.level, label: l.label }))

/**
 * Build a docket-ready filename + case folder for a drafted document. This is
 * the deterministic "name it like a real filing" step: given when it's drafted,
 * which court level, and a tag, produce the exact filenames the server expects.
 */
export function buildDocketNames(opts: {
  now?: Date
  rules?: TCourtRules
  level: string
  tag: string
}): { docketFile: string; caseFolder: string } {
  const rules = opts.rules ?? defaultRules
  const now = opts.now ?? new Date()
  return {
    docketFile: DocketFileName(now, rules, opts.level, opts.tag),
    caseFolder: CaseFolderName(now, rules, opts.level, opts.tag),
  }
}
