// Copyright AStarship <https://astarship.net>.
/**
 * @freelawgen/court — test suite (node:test + tsx).
 *
 * Verifies the CORE doctrine: the shared deterministic SKELETON + per-country
 * RULES (TCourtRules). The same algorithms run different legal systems.
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, existsSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"

import {
  CourtIterate,
  CourtIterateError,
  CourtByLevel,
  CourtOrderIndex,
  CourtLevels,
  DocketFileName,
  DecisionFileName,
  ValidateTag,
  SortFifo,
  FreedomCourtRules,
  COURT_MAX_DRAFT_REVISIONS,
  type TCourtRules,
} from "../src/index"

const D = new Date("2026-09-17T10:00:00Z")

// A custom country (France-style): 3 levels, cap 32, French log + grammar.
const France: TCourtRules = {
  ...FreedomCourtRules,
  levels: [
    { level: "Tribunal", label: "Tribunal judiciaire" },
    { level: "Cour", label: "Cour d'appel" },
    { level: "Cassation", label: "Cour de cassation" },
  ],
  max_draft_revisions: 32,
  agent_workflow_log: "JournalIA.ndjson",
  docket_template: (s, t, e) => `${s}__${t}.${e}`,
}

// --- Filename grammar is per-country ---
test("DocketFileName — Freedom Court grammar (two hyphens)", () => {
  assert.equal(DocketFileName(D, FreedomCourtRules, "Local", "Complaint"), "2026-09-17;10-00-00--Complaint.md")
})

test("DocketFileName — France grammar (two underscores)", () => {
  assert.equal(DocketFileName(D, France, "Tribunal", "Requete_X"), "2026-09-17;10-00-00__Requete_X.md")
})

test("DecisionFileName — CamelCase title, per-country template", () => {
  assert.equal(DecisionFileName(D, FreedomCourtRules, "ComplaintDenied"), "2026-09-17;10-00-00-ComplaintDenied.Decision.md")
  assert.throws(() => DecisionFileName(D, FreedomCourtRules, "bad title"), /CamelCase/)
})

test("ValidateTag — per-country tag policy", () => {
  assert.equal(ValidateTag(FreedomCourtRules, "Local", "Mccollough_v_Psu"), "Mccollough_v_Psu")
  assert.throws(() => ValidateTag(FreedomCourtRules, "Local", "has space"), /Invalid/)
  assert.throws(() => ValidateTag(FreedomCourtRules, "Local", "1starts_with_digit"), /Invalid/)
})

// --- Levels are per-country ---
test("CourtLevels / CourtByLevel / CourtOrderIndex — Freedom (4) vs France (3)", () => {
  assert.equal(CourtLevels(FreedomCourtRules).length, 4)
  assert.equal(CourtLevels(France).length, 3)
  assert.equal(CourtByLevel(France, "Cassation")?.label, "Cour de cassation")
  assert.equal(CourtByLevel(FreedomCourtRules, "Supreme")?.label, "Supreme Freedom Court")
  assert.equal(CourtOrderIndex(France, "Tribunal"), 0)
  assert.equal(CourtOrderIndex(FreedomCourtRules, "Appeal"), 2)
  assert.equal(CourtByLevel(France, "Supreme"), undefined, "France has no Supreme level")
})

// --- FIFO ordering (shared algorithm) ---
test("SortFifo — shadow/emergency first, oldest-first within group", () => {
  const items = [
    { queue: "docket", name: "2026-09-17;10-00-00--B.md" },
    { queue: "docket_shadow", name: "2026-09-17;11-00-00--C.md" },
    { queue: "docket", name: "2026-09-17;09-00-00--A.md" },
    { queue: "docket_shadow_sealed", name: "2026-09-17;08-00-00--D.md" },
  ]
  const sorted = SortFifo(items)
  assert.equal(sorted[0].name, "2026-09-17;08-00-00--D.md", "shadow sealed first (earliest in shadow group)")
  assert.equal(sorted[1].name, "2026-09-17;11-00-00--C.md", "shadow group before normal")
  assert.equal(sorted[2].name, "2026-09-17;09-00-00--A.md", "normal oldest first")
  assert.equal(sorted[3].name, "2026-09-17;10-00-00--B.md")
})

// --- Iterate: the deterministic create-only core, per-country rules injected ---
function makeCourt(root: string, rules: TCourtRules): string {
  const dir = path.join(root, rules.cases_folder, "case1")
  mkdirSync(dir, { recursive: true })
  const src = path.join(dir, "Complaint.draft.1.md")
  writeFileSync(src, "---\nversion: 1\niteration: 0\n---\n\nOriginal.\n")
  return src
}

test("CourtIterate — increments, creates new file, leaves source untouched (Freedom)", () => {
  const root = mkdtempSync(path.join(tmpdir(), "flg-"))
  try {
    const src = makeCourt(root, FreedomCourtRules)
    const r = CourtIterate({ document: src, amended: "Amended." }, { court_root: root })
    assert.equal(r.old_draft, 1)
    assert.equal(r.new_draft, 2)
    assert.equal(r.new_file_name, "Complaint.draft.2.md")
    assert.ok(existsSync(r.new_path), "new file created")
    assert.ok(readFileSync(src, "utf8").includes("Original."), "source untouched")
    assert.equal(r.logged, true, "log written")
    // the log is the country's log name (Freedom -> AgentWorkflow.ndjson)
    assert.ok(existsSync(path.join(path.dirname(src), "AgentWorkflow.ndjson")))
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test("CourtIterate — France rules: cap 32 + JournalIA.ndjson log (per-country)", () => {
  const root = mkdtempSync(path.join(tmpdir(), "flg-fr-"))
  try {
    const src = makeCourt(root, France)
    const r = CourtIterate({ document: src, amended: "Requete amende." }, { court_root: root, rules: France })
    assert.equal(r.new_file_name, "Complaint.draft.2.md")
    // the log is the COUNTRY's log name, not AgentWorkflow.ndjson
    assert.ok(existsSync(path.join(path.dirname(src), "JournalIA.ndjson")), "country log name written")
    assert.ok(!existsSync(path.join(path.dirname(src), "AgentWorkflow.ndjson")), "not the default log name")
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test("CourtIterate — cap enforced (Freedom 64, France 32)", () => {
  for (const [rules, cap] of [[FreedomCourtRules, COURT_MAX_DRAFT_REVISIONS], [France, 32]] as [
    TCourtRules,
    number,
  ][]) {
    const root = mkdtempSync(path.join(tmpdir(), "flg-cap-"))
    try {
      const dir = path.join(root, rules.cases_folder, "case1")
      mkdirSync(dir, { recursive: true })
      const atCap = path.join(dir, `Complaint.draft.${cap}.md`)
      writeFileSync(atCap, `draft ${cap}\n`)
      assert.throws(
        () => CourtIterate({ document: atCap }, { court_root: root, rules }),
        (e: unknown) => e instanceof CourtIterateError && e.code === "cap_exceeded",
        `cap ${cap} must refuse draft ${cap + 1}`,
      )
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  }
})

test("CourtIterate — path traversal refused (outside_root)", () => {
  const root = mkdtempSync(path.join(tmpdir(), "flg-xt-"))
  try {
    makeCourt(root, FreedomCourtRules)
    assert.throws(
      () => CourtIterate({ document: "../../etc/passwd" }, { court_root: root }),
      (e: unknown) => e instanceof CourtIterateError && e.code === "outside_root",
    )
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test("CourtIterate — non-draft refused (not_a_draft) + target-exists refused", () => {
  const root = mkdtempSync(path.join(tmpdir(), "flg-nd-"))
  try {
    const dir = path.join(root, "Cases", "case1")
    mkdirSync(dir, { recursive: true })
    const notDraft = path.join(dir, "Final.md")
    writeFileSync(notDraft, "final\n")
    assert.throws(
      () => CourtIterate({ document: notDraft }, { court_root: root }),
      (e: unknown) => e instanceof CourtIterateError && e.code === "not_a_draft",
    )
    // target-exists: create draft.2 then try to increment draft.1
    const d1 = path.join(dir, "Petition.draft.1.md")
    const d2 = path.join(dir, "Petition.draft.2.md")
    writeFileSync(d1, "v1\n")
    writeFileSync(d2, "v2\n")
    assert.throws(
      () => CourtIterate({ document: d1 }, { court_root: root }),
      (e: unknown) => e instanceof CourtIterateError && e.code === "target_exists",
    )
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
