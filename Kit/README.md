# `@freelawgen/court` — the deterministic Court procedure API

The open-source, **deterministic** Court procedure skeleton. This is the shared
library that every Court builds its own custom app on.

The Captain's doctrine: *"Each Country's legal system is different, so think of
FreeLawGen as the shared library, and each Court must make their own impl."*

So the Kit provides the **deterministic algorithms** (the skeleton) — document
iteration, filename grammar, case numbers, FIFO queue ordering — and the
**country** provides its **rules** (`TCourtRules`): its court hierarchy, tag
policy, revision cap, log name, filename templates. The same shared code runs a
Local Freedom Court in the US, a tribunal in France, or a corte in Brazil.

> **Who it's for:** regular people defending themselves in court (pro se
> litigants) and States building their own court systems. **Not** for attorneys
> to commercialize. See [LICENSE](./LICENSE) (AStartup Strong Source-available).

## Install

```bash
pnpm install
pnpm build      # -> dist/ (CJS + ESM + .d.ts)
pnpm test       # node --test (31 tests)
pnpm verify     # build + test
```

Peer dependencies: `@astarship/subsecond-id` (the 64-bit Hot-UUID case-number
namespace) and `next` (>= 14, for the HTTP handler). Node >= 20.

## The skeleton (deterministic algorithms)

| Function | What it does |
|----------|--------------|
| `CourtIterate` | Create-only, deterministic legal-document revision. Increment a draft to its next revision, appending to the per-case agentic-workflow log. Refuses path traversal, non-drafts, and existing targets. |
| `CourtResolvePath` / `CourtRoot` | Resolve a path safely under the court root (no `..` escape). |
| `DocketFileName(d, rules, level, tag)` | The country's docket filename (e.g. `YYYY-MM-DD;HH-MM-SS--Tag.md`). |
| `CaseFolderName(d, rules, level, tag)` | The case folder name. |
| `DecisionFileName(d, rules, camelTitle)` | A judge-decision filename (`stamp-Title.Decision.md`). |
| `ValidateTag` / `TagPolicyFor` | Validate a docket tag against the level's tag policy. |
| `SortFifo` / `FifoComparator` | FIFO queue ordering (shadow/emergency first, oldest-first). |
| `CourtLevels` / `CourtByLevel` / `CourtOrderIndex` | Accessors over the country's court hierarchy. |
| `MarkdownWordCount(src)` | Deterministic word count of a pleading (excludes frontmatter, markup, list markers). |
| `exportToPleadingPdf(mdPath, outPdfPath)` | Render a Markdown pleading to a formatted PDF (Node; file-system based). |
| `CaseNumberNew` / `InitCaseNumberMinter` / … | The 64-bit SubsecondId case-number namespace (a case = one 64-bit inode lookup). Node-only (`crypto` + `process.env`). |

## The rules (per-country impl)

`TCourtRules` is the shape a country fills in:

```ts
interface TCourtRules {
  levels: readonly TCourtLevelInfo[]          // the court hierarchy (ascending)
  tag_policies: Partial<Record<string, ITagPolicy>> | ITagPolicy
  max_draft_revisions: number                 // the "64" is a Freedom Court choice
  agent_workflow_log: string                  // the per-case log filename
  cases_folder: string                        // the folder holding a case's docs
  docket_template: (stamp, tag, ext) => string
  decision_template: (stamp, title) => string
}
```

`FreedomCourtRules` is the **default** implementation (the Captain's Freedom
Court: 4 levels — Local, District, Appeal, Supreme — the `freedom-*` slugs, the
64-revision cap, the standard docket grammar). A country that wants the bare
skeleton supplies its own `TCourtRules`.

## The court is a folder + config

There is **no hardcoded home directory**. A Court is a folder (the court root)
plus a `TCourtRules` config — portable to any machine or country. The
open-source Court is for the whole world.

## Consumers

- **`FreeLawGen/App`** — the open-source React Native client (thin, points at
  the user's own local LLM).
- **`FreeLawGen/Web`** — the open web (a court's custom Next.js app on the Kit).
- **`FreeLawGenWeb_`** — the for-profit Next.js REST wrapper (closed source).
- Any State's custom court app.

## License

AStartup Strong Source-available License — see [LICENSE](./LICENSE).
Source-available, non-commercial.
