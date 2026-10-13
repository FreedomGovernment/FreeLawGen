// Copyright AStarship <https://astarship.net>.
import assert from "node:assert/strict"
import { test } from "node:test"
import { MarkdownWordCount } from "../src/index"

test("MarkdownWordCount is public and counts prose without the private header", () => {
  const count = MarkdownWordCount
  const source = '---\ntitle: "Private metadata words"\n---\n\n# Public title\n\nOne **bold** word.\n'
  const report = count(source)
  assert.equal(report.word_count, ["Public", "title", "One", "bold", "word"].length)
  assert.equal(report.frontmatter_excluded, true)
  assert.equal(report.method, "freelawgen-markdown-words-v1")
})

for (const [label, markdown, words] of [
  ["empty", "", []],
  ["punctuation", "— § ### ...", []],
  ["Unicode and numbers", "Coandă don't State’s 11,000 self-represented", ["Coandă", "don't", "State’s", "11,000", "self-represented"]],
  ["inline adjacency", "pre**existing** and `code`", ["preexisting", "and", "code"]],
  ["headings and lists", "# Heading words\n\n1. First item\n2. Second item", ["Heading", "words", "First", "item", "Second", "item"]],
  ["links and definitions", '[two words](https://example.test/path "hidden title") [Case][case]\n\n[case]: https://example.test/ "hidden metadata"', ["two", "words", "Case"]],
  ["footnotes", "# Heading\n\nText[^note]. Again[^note].\n\n[^note]: Footnote **two** words.", ["Heading", "Text", "Again", "Footnote", "two", "words"]],
  ["quotations", "> Quoted words.\n\nOrdinary text.", ["Quoted", "words", "Ordinary", "text"]],
  ["tables", "| Alpha | Beta |\n|---|---|\n|One|Two|", ["Alpha", "Beta", "One", "Two"]],
  ["fenced code", "```text\ncode words\n```", ["code", "words"]],
  ["image alt text", "![two words](picture.png)", ["two", "words"]],
  ["internal horizontal rule", "One\n\n---\n\nTwo", ["One", "Two"]],
] as const) {
  test(`MarkdownWordCount — ${label}`, () => {
    assert.equal(MarkdownWordCount(markdown).word_count, words.length)
  })
}

test("LF and CRLF produce identical results; quoted dashes do not end metadata", () => {
  const source = '---\ntitle: "Private: title"\nnote: "---"\n---\n\nPublic body.\n'
  assert.deepEqual(MarkdownWordCount(source), MarkdownWordCount(source.replace(/\n/g, "\r\n")))
  assert.equal(MarkdownWordCount(source).word_count, ["Public", "body"].length)
})

test("explicit no-frontmatter mode allows a leading Markdown rule", () => {
  assert.deepEqual(MarkdownWordCount("---\n\nBody words", { frontmatter: "none" }), {
    word_count: ["Body", "words"].length,
    method: "freelawgen-markdown-words-v1",
    frontmatter_excluded: false,
  })
})

test("unclosed, stacked, and BOM-prefixed frontmatter fail without a guessed count", () => {
  assert.throws(() => MarkdownWordCount('---\ntitle: "Unclosed"'), /Unclosed/)
  assert.throws(() => MarkdownWordCount('---\ntitle: "A"\n---\n\n---\ntitle: "B"\n---\nText'), /Ambiguous/)
  assert.throws(() => MarkdownWordCount('\uFEFF---\ntitle: "A"\n---\nText'), /BOM/)
})

