---
title: FreeLawGen — README
description: "The Freedom Law Generator (FreeLawGen): open-source legal-document and campaign generator platform and Chrome extension using Pandocs Markdown."
---
# FreeLawGen

The Freedom Law Generator (FreeLawGen) by the Freedom Government is an open-source law document and campaign generator vibe coding platform and Chrome Extension that provides equal access to the legal system by leveraging Pandocs Markdown to help you refine your legal argument, timeline, evidence, calendar, milestones, law library, filings, blog, vlog, advertising, and fund raising.

## Quickstart

1. Download repo zip file and extract to a folder.
2. Open the file explorer and navigate to the folder.
3. Copy and paste the Template folder into your workspace/desktop/cloud drive/etc.
4. Add the folder to your VS Code, Notepad++, etc workspace.
5. Read all the Markdown files.
6. Open a terminal and navigate to the folder.
7. Type command `opencode`, then ask a question.

## Master Plan

The **FreedomCourt app** (the AI Court server behind FreeLawGen) is a companion
mobile/web app for getting legal documents into the court as Markdown:

- **Scan in a bunch of photos** of legal documents, handwritten notes,
  screenshots, diagrams, and images.
- **Convert them to Markdown** (OCR + layout) so every artifact — even a
  handwritten note or a photo of a signed pleading — becomes a first-class
  court document in the docket.
- The output drops straight into the upload path (the same Markdown a user
  would type or pull from OneDrive/Drive), so a scan and a typed complaint are
  indistinguishable to the clerk and judge.

This is the "get McCollough v. PSU going" workhorse: the existing paper and
photo record becomes a Markdown docket automatically, instead of being
re-keyed by hand. It pairs with the REST API + skills (the MCP server in TS)
that give the legal agents the perfect context — not a command-line tool.

The court itself runs on Next.js API endpoints (one set of APIs across all our
products, so the agents are most effective). Each court — Local, District,
Appeal, Supreme — has its own page and its own rules, all sharing one TS
tooling base. The Local Court is the self-improving complaint/petition loop
(Hermes Agent SOUL.md files + REST API + skills), running a local LLM with
unlimited tokens. The docket is Markdown (hot storage) mirrored to an ACID
database (cold storage); a case is a 64-bit SubsecondId, and a docket is a
FIFO main queue (oldest first) with a shadow (emergency) docket that drains
before the regular docket.

## The deterministic Court procedure API

**`Kit/` (`@freelawgen/court`)** is the open-source, deterministic Court
procedure skeleton — the shared library every Court builds its own custom app
on. It is country-agnostic: the Captain's doctrine is "each country's legal
system is different, so think of FreeLawGen as the shared library, and each
Court must make their own impl."

The Kit provides the **deterministic algorithms** (the skeleton):

- **Document iteration** — create-only, deterministic legal-document revision
  (`CourtIterate`), with a per-case agentic-workflow log.
- **Docket filename grammar** — `DocketFileName`, `CaseFolderName`,
  `ValidateTag` (the country's docket naming rules, e.g.
  `YYYY-MM-DD;HH-MM-SS--Tag.md`).
- **Court levels** — `FreedomCourtRules` (the default 4-level Freedom Court);
  a State supplies its own `TCourtRules`.
- **64-bit SubsecondId case numbers** — `CaseNumberNew` + the Hot-UUID
  namespace (a case is a single 64-bit inode lookup).
- **FIFO queue** — `SortFifo` (the court's processing order, shadow first).
- **Pleading export** — `exportToPleadingPdf` (DOCX/PDF from Markdown).
- **Word count** — `MarkdownWordCount` (deterministic, excludes frontmatter).

The **country** provides the **rules** (`TCourtRules`): its court hierarchy,
tag policy, revision cap, log name, filename templates. The same shared code
runs a Local Freedom Court in the US, a tribunal in France, or a corte in
Brazil. See [`Kit/README.md`](./Kit/README.md) for the full API.

### The React Native app

**`App/` (`freelawgen-app`)** is the open-source reference client — a thin
Expo/React Native app for **regular people defending themselves in court**.
It points at **your own local LLM** (Ollama / llama.cpp / LM Studio) — FreeLawGen
is not the middleman — and uses the Kit to draft, name, and count docket-ready
pleadings, entirely on your machine. See [`App/README.md`](./App/README.md).

## Who this is for

FreeLawGen is a **semi-non-profit, public-benefit** project. It is built for:

- **Regular people** defending themselves in court (self-represented / pro se
  litigants) — the McCollough v. Portland State University case is the
  national proof that a pro se civil-rights complaint works.
- **States** building their own court systems on the shared deterministic
  skeleton.

It is **not** for attorneys to commercialize. FreeLawGen's revenue model is
public-benefit services (a digital evidence locker, API tokens, and rented
server time for simulations), not reselling the tool. The license keeps it free
for pro se litigants and States while preventing third parties from profiting
off derivative works without a paid license.

## License

Copyright [Freedom Government](https://github.com/FreedomGovernment).

This source form is a source-available content, the Writings and Discoveries, that was written by and contains intellectual property belonging to the IP Owner. The Writings and Discoveries consist of documents, files, source code, technology design files, art, trademarks, and other content contained this file, folder and the GitHub repository, the Repo, located at <https://github.com/FreedomGovernment/FreeLawGen>. The Writings and Discoveries are published under the AStartup Strong Source-available License, the License, which is a non-commercial open-source license and is for educational and demonstration purposes only. To use the Writings and Discoveries for commercial purposes, you must download the Writings and Discoveries from <https://freedomgovernment.org> and you will be bound to the license agreed upon before downloading the Writings and Discoveries. You may use, reproduce, publicly display, and modify the Writings and Discoveries so long as you submit and donate fixes and derived intellectual property, the Donated Ideas, to the Repo as an Issue ticket and Pull Request to become part of the Writings and Discoveries. You may not sell the Writings and Discoveries or otherwise profit from derivative works created from the Writings and Discoveries, refereed to as Third-party commercialization, without the expressed written permission of the copyright holder. Unless required by applicable law or agreed to in writing, the Writings and Discoveries distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

### Definitions

Presenting arguments, evidence, information, etc to the Court are demonstration purposes. Attorneys personally using the Writings and Discoveries for their clients is not commerce, but reselling the Writings and Discoveries as a web service or any type of product for sale is commerce.
