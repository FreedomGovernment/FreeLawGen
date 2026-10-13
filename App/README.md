# FreeLawGen App (React Native)

A **thin, open-source React Native client** for regular people defending
themselves in court (self-represented / pro se litigants) — and for States
building their own court systems.

**FreeLawGen is not the middleman.** This app never calls a hosted LLM. You
point it at a model running **on your own machine or LAN** (Ollama, llama.cpp,
or LM Studio), and it uses the `@freelawgen/court` deterministic Court
procedure toolkit to draft, name, and count docket-ready pleadings. Your data
and your model never leave your machine.

> This is a drafting aid, **not legal advice**. You review, edit, and file the
> document through your court.

## Why this exists

The McCollough v. Portland State University case — a pro se civil-rights
complaint — is nationally known. FreeLawGen's mission is **access to justice
for people without lawyers**, and for States to build their own court systems
on a shared, deterministic skeleton. The React Native app is the reference
client that shows how a regular person runs the whole thing locally.

## How it works

1. **Endpoint** — you configure your own local LLM (base URL + optional key +
   model name). Stored on-device, sent only to your endpoint.
2. **Draft** — pick a document type (Complaint, Answer, Motion, …), a court
   level, and a docket tag. Describe your situation in plain language.
3. **Local model drafts** — the app asks *your* model to produce the pleading
   as Markdown, using a system prompt that forbids inventing facts (it uses
   `[PLACEHOLDER]` for anything missing).
4. **Deterministic naming** — the `@freelawgen/court` toolkit computes the
   docket filename + case folder (the court's filename grammar) and the word
   count. These are deterministic — they match what the court expects.
5. **You edit + file** — copy the draft into your court's filing system.

## The deterministic Court procedure toolkit

The app consumes [`@freelawgen/court`](../Kit/) (see `../Kit/README.md`), the
open-source skeleton:

- **Filename grammar** — `DocketFileName`, `CaseFolderName`, `ValidateTag`
  (the country's docket filename rules, e.g. `YYYY-MM-DD;HH-MM-SS--Tag.md`).
- **Word count** — `MarkdownWordCount` (deterministic, excludes frontmatter).
- **Court levels** — `FreedomCourtRules` (the default 4-level Freedom Court);
  a State supplies its own `TCourtRules`.
- **FIFO queue** — `SortFifo` (the court's processing order).

The case number (64-bit SubsecondId) and PDF/DOCX export are **Node-only** (they
need Node `crypto` + the file system) and run on the user's local server, not
in the app — see the "Server-side" note below.

## Getting started

```bash
cd App
pnpm install
pnpm start          # Expo dev server; scan the QR with Expo Go
```

Then open the **Endpoint** tab and point it at your local model:

| Server      | Base URL                    | Example model |
|-------------|-----------------------------|---------------|
| Ollama      | `http://<host>:11434/v1`    | `llama3.1`    |
| llama.cpp   | `http://<host>:8080/v1`     | your model    |
| LM Studio   | `http://<host>:1234/v1`     | your model    |

From a phone, use your machine's **LAN IP** (e.g. `http://192.168.x.x:11434/v1`),
not `localhost`.

## Stack

- **Expo** (managed) + **React Native** + **TypeScript**
- **`@freelawgen/court`** (file-linked `../Kit`) — the deterministic Court toolkit
- **`@react-native-async-storage/async-storage`** — on-device settings
- No hosted LLM. No telemetry. No backend required to draft.

## Server-side (case numbers + export)

Two Kit capabilities are Node-only and run on a server (yours, on your LAN):

- **Case number minting** (`InitCaseNumberMinter` / `CaseNumberNew`) needs Node
  `crypto` + `process.env.FREEDOM_COURT_SERVER_ID`.
- **Pleading export** (`exportToPleadingPdf`) reads/writes files.

A small local server (the for-profit `FreeLawGenWeb_` REST wrapper, or your own)
exposes these; the RN app gets the case number at filing time and can request a
PDF/DOCX export by document path. The in-app draft + naming + word count is fully
local and needs no server.

## License

AStartup Strong Source-available License — see [LICENSE](./LICENSE).
Source-available, non-commercial. Built for pro se litigants and States, not
for attorneys to commercialize.
