// Copyright AStarship <https://astarship.net>.
import MarkdownIt from "markdown-it"
import Footnote from "markdown-it-footnote"
import type Token from "markdown-it/lib/token.mjs"

export interface TWordCountOptions {
  /** Use "none" when a leading --- is a Markdown rule rather than metadata. */
  frontmatter?: "auto" | "none"
}

export interface TWordCountResult {
  word_count: number
  method: "freelawgen-markdown-words-v1"
  frontmatter_excluded: boolean
}

const Parser = new MarkdownIt({ html: false, linkify: false, typographer: false })
// The plugin declarations reference markdown-it's CJS type mirror, while the
// ESM build resolves its ESM mirror. Both describe the same runtime parser.
Footnote(Parser as unknown as Parameters<typeof Footnote>[0])

function InlineText(tokens: readonly Token[]): string {
  return tokens.map(token => {
    if (token.type === "text" || token.type === "code_inline") return token.content
    if (token.type === "softbreak" || token.type === "hardbreak") return "\n"
    if (token.type === "image") return InlineText(token.children ?? [])
    return ""
  }).join("")
}

/**
 * Count rendered Markdown text, without changing or exporting the source.
 * Includes headings, quotations, footnote text, tables, code, and image alt text.
 * Excludes leading frontmatter, markup, list markers, and hidden link targets.
 * A word is a whitespace-delimited token containing a Unicode letter or number;
 * internal hyphens/apostrophes remain part of a token. This is not a court rule
 * or a promise of identical counts from Word, LibreOffice, or other software.
 * Frontmatter delimiting here is for counting only, not YAML/schema validation
 * or the legal-document submission/re-enveloping boundary.
 */
export function MarkdownWordCount(
  source: string,
  options: TWordCountOptions = {},
): TWordCountResult {
  if (source.startsWith("\uFEFF")) throw new Error("UTF-8 BOM is not supported")
  if (options.frontmatter !== undefined && !["auto", "none"].includes(options.frontmatter)) {
    throw new Error("frontmatter must be auto or none")
  }
  let body = source
  let frontmatter_excluded = false
  if (options.frontmatter !== "none") {
    const lines = source.split(/\r\n|\n|\r/)
    if (lines[0] === "---") {
      const end = lines.indexOf("---", 1)
      if (end < 0) throw new Error("Unclosed leading frontmatter")
      body = lines.slice(end + 1).join("\n")
      frontmatter_excluded = true
      if (body.trimStart().startsWith("---\n")) {
        throw new Error("Ambiguous second leading frontmatter block")
      }
    }
  }
  const text = Parser.parse(body, {}).map(token => {
    if (token.type === "inline") return InlineText(token.children ?? [])
    if (token.type === "fence" || token.type === "code_block") return token.content
    return ""
  }).join("\n")
  const word_count = (text.match(/\S+/gu) ?? []).filter(word => /[\p{L}\p{N}]/u.test(word)).length
  return { word_count, method: "freelawgen-markdown-words-v1", frontmatter_excluded }
}
