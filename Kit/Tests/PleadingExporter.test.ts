// Copyright AStarship <https://astarship.net>.
import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { test } from "node:test"

import { exportToPleadingPdf } from "../src/court/PleadingExporter"

// Integration test: requires LibreOffice and pdftotext on PATH.
// Verify the rendered PDF, not merely the source or DOCX configuration.

// A pleading body with a caption block, a party block, a jury-demand line, and
// enough paragraphs to force a second page. The party name is deliberately NOT
// any real case (regression guard: the exporter must not special-case McCollough).
const CAPTION_FIXTURE = [
  "---",
  'title: "PRIVATE TITLE MUST NOT BECOME THE FOOTER"',
  "---",
  "",
  "Synthetic export test; not a filing.",
  "",
  "# FIRST AMENDED COMPLAINT",
  "",
  "UNITED STATES DISTRICT COURT",
  "DISTRICT OF OREGON",
  "EUGENE DIVISION",
  "",
  "JERRY EXAMPLESON,",
  "Plaintiff,",
  "",
  "v.",
  "",
  "EXAMPLE COUNTY GOVERNMENT,",
  "Defendant.",
  "",
  "Case No. 6:25-cv-00000-XXX",
  "",
  "FIRST AMENDED COMPLAINT",
  "Jury Trial Demanded",
  "",
  ...Array.from({ length: 40 }, (_, index) =>
    `${index + 1}. Synthetic paragraph for checking the footer across page boundaries.\n`),
].join("\n")

// The exact line-pairs that must NOT collapse onto a single rendered line.
const CAPTION_MUST_NOT_COLLAPSE = [
  "UNITED STATES DISTRICT COURT DISTRICT OF OREGON",
  "DISTRICT OF OREGON EUGENE DIVISION",
  "JERRY EXAMPLESON, Plaintiff,",
  "EXAMPLE COUNTY GOVERNMENT, Defendant.",
  "FIRST AMENDED COMPLAINT Jury Trial Demanded",
]

// Individual lines that must each appear as their own rendered line.
const CAPTION_LINES_PRESENT = [
  "EUGENE DIVISION",
  "JERRY EXAMPLESON,",
  "Plaintiff,",
  "v.",
  "Defendant.",
  "Jury Trial Demanded",
]

for (const title of ["SECOND AMENDED COMPLAINT", "RESPONSE TO COMPLAINT"]) {
  test(`PDF footer uses ${title} and consecutive page numbers`, async () => {
    const directory = mkdtempSync(path.join(tmpdir(), "freelawgen-footer-"))
    try {
      const source = path.join(directory, "Fixture.md")
      const output = path.join(directory, "Fixture.pdf")
      const content = [
        "---",
        'title: "PRIVATE TITLE MUST NOT BECOME THE FOOTER"',
        "---",
        "",
        "Synthetic export test; not a filing.",
        "",
        `# ${title}`,
        "",
        ...Array.from({ length: 40 }, (_, index) =>
          `${index + 1}. Synthetic paragraph for checking the footer across page boundaries.\n`),
      ].join("\n")
      writeFileSync(source, content, { flag: "wx" })
      await exportToPleadingPdf(source, output)
      const text = execFileSync("pdftotext", ["-layout", output, "-"], {
        encoding: "utf8",
      })
      const pages = text.split("\f").filter(page => page.trim())
      assert.ok(pages.length > 1, "Fixture must span multiple pages")
      for (const [index, page] of pages.entries()) {
        const normalized = page.replace(/\s+/g, " ").trim()
        assert.ok(
          normalized.endsWith(`${title} — Page ${index + 1}`),
          `Page ${index + 1} is missing its document-specific footer: ${normalized.slice(-100)}`,
        )
        assert.ok(!page.includes("COURT DOCUMENT"), "Generic footer must not remain")
        assert.ok(!page.includes("PRIVATE TITLE"), "Private frontmatter must not render")
      }
      assert.equal(readFileSync(source, "utf8"), content, "Source must remain unchanged")
      assert.ok(
        !existsSync(path.join(directory, "Fixture.docx")),
        "Scratch DOCX must be removed after export",
      )
    } finally {
      // Only synthetic test artifacts are removed; never case documents.
      rmSync(directory, { recursive: true, force: true })
    }
  })
}

test("PDF caption, party block, and jury demand render on separate lines", async () => {
  const directory = mkdtempSync(path.join(tmpdir(), "freelawgen-caption-"))
  try {
    const source = path.join(directory, "Fixture.md")
    const output = path.join(directory, "Fixture.pdf")
    writeFileSync(source, CAPTION_FIXTURE, { flag: "wx" })
    await exportToPleadingPdf(source, output)
    const text = execFileSync("pdftotext", ["-layout", output, "-"], {
      encoding: "utf8",
    })
    const normalized = text.replace(/\s+/g, " ")
    // Strip the left-margin pleading line number so the rendered caption text can
    // be matched exactly (e.g. " 6   EUGENE DIVISION" -> "EUGENE DIVISION").
    const bareLine = (l: string) => l.replace(/^\s*\d+\s+/, "").trim()
    for (const collapsed of CAPTION_MUST_NOT_COLLAPSE) {
      assert.ok(
        !normalized.includes(collapsed),
        `Caption lines collapsed onto one line: "${collapsed}"`,
      )
    }
    for (const line of CAPTION_LINES_PRESENT) {
      assert.ok(
        text.split("\n").some(l => bareLine(l) === line),
        `Expected a dedicated rendered line for: "${line}"`,
      )
    }
    // No private frontmatter leakage.
    assert.ok(!text.includes("PRIVATE TITLE"), "Private frontmatter must not render")
    assert.ok(readFileSync(source, "utf8") === CAPTION_FIXTURE, "Source must remain unchanged")
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
})
