// Copyright AStarship <https://astarship.net>.
import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import { spawnSync } from "node:child_process"
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { test } from "node:test"

const Cli = path.resolve("src/court/WordCountCli.ts")

test("word-count CLI emits reproducible JSON and supports explicit source-line ranges", () => {
  assert.ok(existsSync(Cli), "The reusable word-count CLI must exist")
  const directory = mkdtempSync(path.join(tmpdir(), "freelawgen-word-count-"))
  try {
    const source = path.join(directory, "Document with spaces.md")
    const lines = ['---', 'title: "Private metadata words"', '---', '', '# Heading', '', 'Body words.', '', 'CERTIFICATE', '', 'Service words.']
    const content = lines.join("\n")
    writeFileSync(source, content, { flag: "wx" })
    const invoke = (args: string[]) => spawnSync(process.execPath,
      ["--import", "tsx", Cli, source, ...args], { encoding: "utf8" })
    const full = invoke([])
    assert.equal(full.status, 0, full.stderr)
    const report = JSON.parse(full.stdout)
    assert.equal(report.word_count, ["Heading", "Body", "words", "CERTIFICATE", "Service", "words"].length)
    assert.equal(report.source_sha256, createHash("sha256").update(content).digest("hex"))
    assert.equal(report.frontmatter_excluded, true)
    const start = lines.indexOf("# Heading") + 1
    const end = lines.indexOf("Body words.") + 1
    const selected = invoke(["--from-line", String(start), "--through-line", String(end)])
    assert.equal(selected.status, 0, selected.stderr)
    assert.equal(JSON.parse(selected.stdout).word_count, ["Heading", "Body", "words"].length)
    assert.equal(JSON.parse(selected.stdout).from_line, start)
    assert.equal(JSON.parse(selected.stdout).through_line, end)
    for (const args of [["--from-line", "0"], ["--from-line", "2x"], ["--from-line", "9", "--through-line", "2"], ["--through-line", "999"], ["--unknown"]]) {
      const invalid = invoke(args)
      assert.notEqual(invalid.status, 0)
      assert.equal(invalid.stdout, "", "Invalid input must not emit a misleading count")
    }
    assert.equal(readFileSync(source, "utf8"), content, "Counting is read-only")
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
})

test("word-count CLI rejects invalid UTF-8 instead of counting replacement characters", () => {
  assert.ok(existsSync(Cli), "The reusable word-count CLI must exist")
  const directory = mkdtempSync(path.join(tmpdir(), "freelawgen-word-count-"))
  try {
    const source = path.join(directory, "Invalid.md")
    writeFileSync(source, Buffer.from([0xff, 0xfe]), { flag: "wx" })
    const result = spawnSync(process.execPath, ["--import", "tsx", Cli, source], { encoding: "utf8" })
    assert.notEqual(result.status, 0)
    assert.equal(result.stdout, "")
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
})
