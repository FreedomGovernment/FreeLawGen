#!/usr/bin/env node
// Copyright AStarship <https://astarship.net>.
import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import path from "node:path"
import { parseArgs, TextDecoder } from "node:util"
import { MarkdownWordCount } from "./WordCount"

const Usage = "Usage: word-count <file.md> [--from-line N] [--through-line N] [--no-frontmatter]"

function LineNumber(value: string | undefined, fallback: number): number {
  if (value === undefined) return fallback
  if (!/^[1-9][0-9]*$/.test(value) || !Number.isSafeInteger(Number(value))) {
    throw new Error("Line numbers must be positive safe integers")
  }
  return Number(value)
}

try {
  const { values, positionals } = parseArgs({
    options: {
      "from-line": { type: "string" },
      "through-line": { type: "string" },
      "no-frontmatter": { type: "boolean", default: false },
      help: { type: "boolean", default: false },
    },
    allowPositionals: true,
    strict: true,
  })
  if (values.help) {
    console.log(Usage)
  } else {
    if (positionals.length !== 1) throw new Error(Usage)
    const bytes = readFileSync(positionals[0])
    // Preserve a BOM so the counter can reject it rather than hiding it.
    const source = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(bytes)
    const lines = source.split(/\r\n|\n|\r/)
    if (lines.length > 1 && lines[lines.length - 1] === "") lines.pop()
    const from_line = LineNumber(values["from-line"], 1)
    const through_line = LineNumber(values["through-line"], lines.length)
    if (from_line > through_line || through_line > lines.length) {
      throw new Error("Requested line range is outside the source or reversed")
    }
    const selected = lines.slice(from_line - 1, through_line).join("\n")
    const result = MarkdownWordCount(selected, {
      frontmatter: values["no-frontmatter"] ? "none" : "auto",
    })
    console.log(JSON.stringify({
      ...result,
      source_name: path.basename(positionals[0]),
      source_sha256: createHash("sha256").update(bytes).digest("hex"),
      source_bytes: bytes.length,
      from_line,
      through_line,
    }, null, 2))
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : "Word count failed")
  process.exitCode = 1
}
