# FreeLawGen — Agent Master Plan

Status: Architecture and execution plan; no production deployment authorized by this document
Plan date: 2026-09-10
Project root: `~/FreedomGovernment/FreeLawGen/`
Implementation root: `~/FreedomGovernment/FreeLawGen/Web/`
Proving case: `~/FreedomGovernment/McColloughVsPSU_/`

## 1. Mission and boundary

Build a free, open, auditable legal-work platform that helps a person organize a case, preserve evidence, understand procedural posture, retrieve the right materials within a limited context budget, prepare working legal documents, and export a portable Git repository.

FreeLawGen is the open-source library used to build a Court. Our implementation is the Freedom Court. We operate as a semi-non-profit (we operate for-profit but behave like a non-profit). The core strategy is to use FreeLawGen to lower the AI compute costs of our other startups. We aim to turn a profit by helping people, providing free AI attorney services, and securing Government public defender contracts. 

**Hardware & Inference Context:**
We rely on heavy, hyper-local inference to make this economically viable. The local fleet includes:
- Dual Arc B70 running Qwen 3.8 27B FP8 (96GB DDR5 6400, 64GB dedicated to KV RAM Cache).
- RTX 50070 and dual RTX 5060 TI 16GB PP=3 running Nemotron 3 Nano 4B FP8 (210K context) and Nemotron 3 Nano Omni 30B A3B (32GB DDR5 5200, 16GB dedicated to KV RAM Cache).
Because this room gets extremely hot and tokens are compute-heavy, FreeLawGen *must* provide a perfectly deterministic REST API for all Court procedures. Do not use LLMs for structural routing, metadata stripping, or queue logic—use deterministic code to give the LLM monsters a clear, focused plan to hammer out.

FreeLawGen is legal-support software, not a licensed lawyer. It must not promise outcomes, create an attorney-client relationship, characterize drafts as filings, or conceal uncertainty. High-stakes filings, deadlines, criminal matters, sanctions exposure, appeals, immunity, and jurisdiction-specific strategy require qualified counsel review wherever reasonably available.

The product's first obligation is not eloquence. It is provenance: users and reviewers must be able to identify which source supports every consequential statement and reproduce the exact context given to the model.

## 2. Verified current baseline

### Current direction — API-based court workflow (2026-09-16)

This update supersedes older direct-agent-message assumptions for clerk handoffs. It records requirements, not a production-readiness claim. The dated inventory below remains a historical baseline and must not be presented as a fresh inspection of the active web build.

- **Transport:** Parties and clerk workflow actors use authenticated Next.js App Router API endpoints. Clerk handoffs are API operations, not direct Bot Chat messages. The server may dispatch Kanban tasks internally through a durable outbox; Kanban remains an execution mechanism, not proof of filing or notice. Discover actual implemented endpoint names before documenting or invoking them.
- **Intake:** One Markdown file-upload path for every permitted size, with configurable hard limits, authorization, immutable original bytes, deterministic UTC timestamp allocation and SHA-256. Preserve the distinction between upload acceptance, administrative docket admission and judicial decisions. Evidence images travel through the scoped evidence locker and are referenced by UUID and description, not embedded in Markdown.
- **Receipts:** Provide a plain-language checklist with pass/fail/pending/not-applicable outcomes, defect reasons, next owner/action, exact artifact ID/version/hash, and authenticated processing provenance. Do not conflate procedural checklist completion with legal sufficiency or merits success. SHA-256 supports integrity comparisons; it does not independently prove authorship, authenticity, court acceptance, or legal validity. No historical novelty claim is made.
- **Visibility:** A case-authorized web tracking view must expose received, validated, queued, running, blocked, decided and notified states as separate events, including retries, errors, pending acknowledgement, current owner and next procedural step. Distinguish operational states from formal court record status. Show rule/checklist versions, correlation IDs and permitted artifact references, without logging or exposing private document bodies, secrets or other cases. Notification requires delivery evidence.
- **Reliability:** Persist ready artifacts and durable delivery events with staged commits/reconciliation. Require idempotency, exclusive claims, completed-artifact gates and bounded retries. No false filesystem/database atomicity claim. Lightweight code heartbeats recover stalled work; judges do not busy-poll with LLM calls.
- **Routing:** Explicit boards are freedom-local-court, freedom-district-court, freedom-appeal-court and freedom-supreme-court. freedom-court is inter-court coordination. freedom-gov is engineering coordination. Party litigation work uses its authorized case board, including mccollough-vs-psu for that case. Never inherit the global current-board pointer.
- **Specification inputs:** Clerk/README.md contains the proposed docket-frontmatter and server-reproduction contract. Each court's CourtRules.md in the separately configured FreedomCourt root supplies its procedure; Local/TrialWorkflow.md describes the simplified trial workflow. These are written contracts, not proof of deployed endpoints or enforced permissions. Source paths are configuration references for engineering, not authorization for court actors to browse private folders.
- **Release gate:** Prioritize a verified upload → receipt/checklist → tracked clerk task vertical slice before unattended trials and cross-court appeals. Test authorization, wrong-board rejection, duplicate delivery, collision/clock handling, crash recovery, checklist clarity and status accuracy using synthetic fixtures. Preserve colleagues' ongoing homepage work. Do not start competing implementation workers, reset the tree, commit, deploy, or send real filings under a status-update task.

**Engineering update requested:** freedom-gov task `t_696e4587`, assigned to web-engineer, asks for its existing owning task/session, completed homepage/routes, exact changed paths, actual build/lint/test results, verified running URL, blockers, next deliverable and alignment with API-based clerk handoffs. Read-back verified the request and a running assigned worker; no substantive reply was available at this check. The user's reported elapsed work time/model is not an independently verified build result. Record the response as attributed until its outputs are verified; do not mark implementation complete from task dispatch alone.

### Historical baseline — 2026-09-10

A full Markdown scan and source-tree inspection on 2026-09-10 found:

- FreeLawGen contains 28 first-party Markdown files when dependency and build-output trees are excluded. Much of the documentation is stub material or imported GitHub style guidance.
- `Web/package.json` defines Next.js 16.3.4, React 19.2.8, TypeScript 6.0.3, Drizzle ORM, PostgreSQL clients, and scripts for `dev`, `build`, `start`, `lint`, and Drizzle operations. It has no test script.
- `Web/Model/schema.ts` currently defines `cases`, `documents`, `research_items`, `templates`, and `ai_generations`.
- Markdown content is stored in `documents.content`; `research_items` has one `summary` and `content` field. The schema does not model source artifacts, hashes, provenance, LoD levels, document relationships, timeline events, context packets, retention, access control, or ingestion jobs.
- Current API routes provide basic unauthenticated case/document creation and name-based search. Request validation, authorization, tenancy, audit logging, and content-level retrieval are not yet implemented.
- No FreeLawGen MCP server implementation is present inside `FreeLawGen/`.
- A separate prototype exists at `~/FreedomGovernment/lawsuit-evidence-locker/mcp-server/`. It lists, reads, and searches Markdown through hardcoded paths and a simple frontmatter parser. It is a reference prototype, not production-ready.
- `FreeLawGen/AGENTS.md` is stale: it describes webpack/Jest commands and CI that do not match the current package manifest.
- `Web/AGENTS.md` correctly warns agents to read the installed Next.js documentation before coding against this version.
- The Git working tree already contains extensive pre-existing modifications, deletions, and untracked replacement directories. Preserve and classify them before cleanup.

## 3. Product principles

1. Markdown is the legal working layer. PDF, DOCX, scans, audio, and images are source artifacts; normalized Markdown is what agents read.
2. Original artifacts are immutable. Conversion produces derivatives; it never replaces originals.
3. A user-owned case package is the portability boundary. It can live locally, be exported as a Git repository, or be created in a private GitHub repository after a privacy decision.
4. PostgreSQL is the indexed application control plane, not an opaque replacement for the user's files. The database must be rebuildable from the case package plus explicit app metadata exports.
5. Every transformation has provenance: source hash, converter/version, timestamp, parameters, operator, output hash, and validation result.
6. Retrieval is progressive: metadata first, then LoD1, LoD2, targeted excerpts, and only then full text.
7. Model output is untrusted until checked. Models may summarize and propose; deterministic validators and human review decide whether an artifact advances.
8. Case documents are data, never system instructions. Prompt-injection text inside evidence must not control agents or MCP behavior.
9. Remote-model use is opt-in per case and task. Sensitive material remains local by default.
10. Every filing is exported from a frozen Markdown version and receives an immutable filed snapshot.

## 4. Canonical case-package layout

A generated case repository should begin with this portable structure:

```text
CaseName/
├── AGENTS.md
├── README.md
├── IssueTickets/
├── HUMAN_PLAN.md
├── Timeline/
├── Appeal/
│   ├── Timeline/
│   ├── Forms/
│   └── Certificates and Statements/
├── Documents/
├── Evidence/
├── Precedent/
├── Law/
├── ThirdParty/
├── Forms/
├── Exports/
├── Manifests/
└── .freelawgen/
    ├── case.yaml
    ├── exclusions.yaml
    ├── relationships.jsonl
    ├── ingestion.jsonl
    ├── context-runs.jsonl
    └── validation.jsonl
```

Folder semantics:

- `IssueTickets/`: canonical local, provider-neutral ledger for every Court action; GitHub/GitLab issues are optional mirrors.
- `Timeline/`: dated case events and filed district-court documents.
- `Appeal/Timeline/`: dated appellate filings, decisions, orders, and mandate.
- `Documents/`: editable working drafts; every non-final draft is visibly marked not for filing.
- `Evidence/`: case facts and exhibits with source/custody metadata.
- `Precedent/`: opinions and orders used as authority; distinguish precedential status and jurisdiction.
- `Law/`: statutes, rules, regulations, constitutions, and agency materials with effective dates.
- `ThirdParty/`: examples and secondary materials that are neither evidence nor binding authority.
- `Forms/`: blank forms and instructions, normally excluded from semantic LoD requirements.
- `Exports/`: generated DOCX/PDF packages; never the agent working layer.
- `Manifests/`: hash and inventory snapshots.
- `.freelawgen/`: machine-readable provenance, relationships, validation, and context-run records.

Users may simplify the layout, but folder meaning must remain explicit. Do not classify a third-party complaint as precedent or a party's allegation as evidence of truth.

## 5. Document identity and metadata contract

Every substantive Markdown source gets a stable document ID independent of filename. Required metadata should include:

- `document_id`
- `title`
- `description` (LoD0)
- `kind`: pleading, motion, brief, order, opinion, mandate, evidence, statute, rule, regulation, form, correspondence, scholarship, operational
- `status`: source, working-draft, review, final, filed, superseded, withdrawn
- `case_id`
- `court`, `case_no`, `docket_no`, `docket_date`, and `filed_at` where applicable
- `jurisdiction` and `effective_date` for law
- `claims` and `issues`
- `source_artifact_id` and source/output hashes
- `related_to`, `supersedes`, `duplicate_of`, and attachment relationships
- `confidentiality`: public, private, sensitive, sealed, privileged-claimed
- `verification_status` and `verified_by`
- `conversion_method`, version, timestamp, and OCR confidence where applicable

Use an actual YAML parser supporting the agreed schema. Do not use a handwritten line parser for production metadata.

## 6. Ingestion and conversion pipeline

### Stage 1 — Intake without mutation

- Accept files, folders, archives, or a repository.
- Quarantine uploads outside the working repository.
- Reject path traversal, symlink escape, device files, and unexpected executable content.
- Hash the original bytes immediately.
- Record filename, MIME/type detection, size, timestamp, uploader, and case.
- Virus/malware scan before conversion.
- Preserve the original artifact under immutable storage with access controls.

### Stage 2 — Convert to normalized Markdown

- DOCX: controlled `python-docx` conversion preserving headings, tables, lists, footnotes where feasible.
- Text PDFs: text extraction with page boundaries retained.
- Scans/images: OCR with page/image provenance and confidence.
- Other media: separate transcription pipeline with timestamps and speaker uncertainty.
- Preserve page anchors such as `## Page N` so citations can return to the source.
- Never silently invent unreadable text. Mark `[No extractable text]`, `[OCR uncertain]`, or a bounded uncertainty span.

### Stage 3 — Clean without changing meaning

- Remove repeated headers/footers only through logged rules.
- Normalize obvious OCR artifacts conservatively.
- Preserve quotations, citations, paragraph numbers, signatures, dates, party names, and docket identifiers exactly.
- Store raw extracted text and cleaned Markdown as separate derivatives.
- Create a conversion diff or transformation log.

### Stage 4 — Add LoD0 frontmatter

Generate a specific one- or two-sentence description that identifies the document, what it contains or decides, and why it matters. Validate names/dates against the body. Mark unknowns rather than guessing.

### Stage 5 — Generate semantic LoD summaries

legal-assistant owns summary generation:

- LoD1: 2–4 sentences.
- LoD2: medium detail with material facts, posture, holdings/allegations, dates, authorities, and relevance.
- Optional higher levels require an explicit use case; LoD3+ is not a default substitute for targeted excerpts.

A valid summary must not be a truncated source head, must distinguish holdings from allegations, and must contain source anchors for consequential propositions.

### Stage 6 — Validate and index

- Confirm every derivative points to an existing source artifact and hash.
- Detect generic descriptions, truncation-shaped summaries, missing disposition language, and contradiction between LoD levels.
- Sample-compare model summaries with source excerpts.
- Extract timeline events, parties, claims, authorities, citations, and document relationships into reviewable records.
- Index metadata, summaries, and segmented text separately.
- Do not publish or feed a failed summary into ordinary retrieval.

## 7. PostgreSQL schema evolution

Preserve current tables through migrations, then add normalized entities:

- `organizations`: tenant and deployment boundary.
- `users`, `memberships`, `roles`: authorization.
- `cases`: current case metadata plus repository/export settings.
- `source_artifacts`: immutable original-object metadata and hashes.
- `documents`: stable logical identity and current classification.
- `document_versions`: Markdown body, frontmatter, hash, status, and parent version.
- `document_derivatives`: raw extraction, cleaned Markdown, DOCX/PDF export, OCR/transcript variants.
- `document_summaries`: document version, LoD level, content, model, prompt/version, source anchors, validation status, and supersession.
- `document_relationships`: attachment, duplicate, supersedes, cites, responds-to, filed-version-of.
- `timeline_events`: date, precision, description, source anchors, verification state.
- `legal_authorities`: citation, jurisdiction, court, precedential status, effective date, treatment, source document.
- `claims_issues`: claim/theory, elements, posture, parties, remedies, disposition, source anchors.
- `evidence_items`: authenticity/custody metadata, proposition, objections, confidentiality.
- `ingestion_jobs` and `conversion_runs`: state, tool versions, logs, hashes, errors.
- `context_runs`: query, model, token budget, selected document versions/levels/excerpts, retrieval scores, prompt hash, and output reference.
- `ai_generations`: retain but add purpose, provider, redaction policy, cost, context-run link, review status, and error class.
- `audit_events`: append-only user/system actions.
- `export_jobs`: Git/DOCX/PDF output, checksums, validation, and destination.

Use row-level organization/case authorization. Do not place raw secrets, provider keys, or unnecessary sensitive content in logs.

## 8. Source-of-truth and synchronization decision

Recommended rule:

- The user-owned Markdown case package and immutable original artifacts are the durable legal record and export source.
- PostgreSQL is the authoritative application index and workflow state, but every legal-content version stored there must have a deterministic case-package representation.
- All app edits go through one content service that writes a version, records its hash and audit event, and queues filesystem/Git synchronization. Failed synchronization is visible and retryable; it is never silently ignored.
- Import and export are round-trip tested. Export → clean import must preserve document IDs, text hashes, metadata, relationships, LoD validation states, and timeline order.

Do not attempt a false cross-system “atomic write” between Git and PostgreSQL. Use an outbox/reconciliation pattern with idempotency keys and an explicit drift report.

## 9. Context-engineering engine

### 9.1 Query classification

Before retrieval, identify:

- Case and tenant
- Jurisdiction and relevant date
- Task type: posture, deadline, factual chronology, element analysis, authority research, pleading draft, evidence gap, damages, or product support
- Required authority tier
- Confidentiality allowance
- Model context limit and cost ceiling
- Whether the output could be filed or otherwise cause irreversible harm

### 9.2 Progressive retrieval

1. Always load the root `README.md` case status and notification aliases, current project/court rules, question, and source hierarchy.
2. Search LoD0 metadata across the scoped case.
3. Rank by document kind, procedural authority, date, issue, claim, relationship, and lexical/semantic relevance.
4. Load LoD1 for the candidate set.
5. Load LoD2 for likely dispositive materials.
6. Load targeted full-text segments with page/line anchors.
7. Add controlling and adverse authority.
8. Add conflicting evidence, not merely supportive evidence.
9. Reserve context for instructions, reasoning, and answer; never fill the whole window with documents.
10. Save the selection and prompt hash as a reproducible context run.

Court documents outrank party briefs; party briefs outrank working notes for what a party argued; authenticated evidence outranks summaries for facts; current law outranks old copies.

### 9.3 Token-budget policy

Use explicit budgets rather than “load everything”:

- Small local classification: LoD0 only.
- Orientation: LoD0 + selected LoD1.
- Decision support: selected LoD2 + controlling full excerpts.
- Filing review: full controlling documents and exact challenged sections, with output reserve.

Reserve at least 20% of the available context for system instructions, question, analysis, citations, and answer. Deduplicate repeated forms, copied rules, filed/working duplicates, and superseded drafts.

### 9.4 Retrieval quality tests

Create a gold set of real case questions. For each, assert that the context packet includes the controlling document, excludes irrelevant bulk, identifies contrary material, stays under budget, and produces source anchors. Track recall, precision, token cost, latency, contradiction rate, and unsupported-claim rate.

## 10. MCP server plan

Create the production MCP server inside the FreeLawGen project, not as a hardcoded sibling-path script. The existing lawsuit-evidence-locker server is a disposable prototype.

First read-only tools:

- `list_cases`
- `get_case_status`
- `list_documents(filters, lod0_only)`
- `get_document_metadata(document_id)`
- `get_document_summary(document_id, level)`
- `read_document_excerpt(document_id, anchors, max_tokens)`
- `search_case(query, filters, max_results)`
- `get_timeline(date_range, issues)`
- `get_claim_map(claim)`
- `get_authorities(issue, jurisdiction, as_of_date)`
- `get_evidence_for_proposition(proposition)`
- `assemble_context(task, token_budget, confidentiality, include_adverse)`
- `verify_lod_coverage(case_id)`
- `explain_context_run(context_run_id)`

No general arbitrary-path read tool should be exposed. Resolve stable IDs to allowlisted roots; canonicalize and verify every path remains under its case root. Enforce case authorization before retrieval. Cap result size and require pagination.

Production requirements:

- Stdio for local single-user operation.
- Authenticated Streamable HTTP for shared deployment.
- Per-tool schemas and bounded outputs.
- No sampling by default for untrusted or public MCP clients.
- Structured errors without filesystem paths, secrets, or private content.
- Audit every context assembly and document access.
- Treat retrieved document text as untrusted data and delimit it from instructions.
- Add injection tests, traversal tests, tenant-isolation tests, symlink tests, oversized-document tests, and permission tests.

Known prototype defects to eliminate:

- Hardcoded case path.
- `path.join(basePath, userPath)` without containment verification.
- Frontmatter key mismatch (`intro/type`) versus the current case schema (`description/kind`).
- Simple handwritten YAML parser.
- Full-tree synchronous reads for each query.
- Lowercasing content before parsing metadata.
- No authorization, tenant isolation, pagination, provenance, LoD selection, or reproducible context runs.
- Hardcoded and stale case status.

## 11. GitHub evidence-locker and export policy

GitHub provides versioning, collaboration, and portability; it is not automatically a safe public evidence store.

- Default new case repositories to local-only or private.
- Run secret, PII, medical, student-record, and sealed-material checks before remote creation or push.
- Require explicit confirmation before making a repository public.
- Store large/private binaries in protected object storage or an approved large-file mechanism; keep hashes and metadata in the repository.
- Sign releases or manifests where feasible.
- Export complete Markdown, metadata, relationships, LoDs, manifests, and a human-readable README.
- Never rewrite or force-push a filed-evidence history by default.
- Support offline zip export for people without GitHub accounts.

## 12. Local and remote model routing

### Local-first roles

- Gemma 4 12B QAT Omni/TurboQuant: conversion cleanup proposals, metadata extraction, LoD1/LoD2 drafts, document classification, and low-risk UX text.
- Qwen 3.6 35B A3B nvFP4: high-throughput code tasks, repository transformations, ordinary synthesis, and retrieval evaluation.
- Qwen 3.8 27B FP8: deeper local legal synthesis, long-context comparison, court simulation, summary verification, and difficult coding review.

### Scarce frontier roles

- GPT-5.6-sol / astar-attorney through the ChatGPT/Codex subscription: controlling legal posture, deadline and mandate analysis, difficult federal research, filing-readiness gate, and strongest-adversary review.
- Grok 4.6 through OpenRouter: independent red team, architecture alternative, overflow, or non-legal specialist review where model diversity has measurable value.

### Feathering policy

1. Run deterministic extraction and local retrieval first.
2. Have a local model produce a structured draft with cited source anchors.
3. Run local verifier/adversary review.
4. Escalate only disputed, high-impact questions to a frontier model with a compact context packet.
5. Route a second frontier model only when independent review could change a consequential decision.
6. Record tokens, dollars, latency, result, and escalation reason.
7. Stop a model/provider when its monthly allocation is reached; never allow an agent loop to spend without a task-level cap.

Initial scarce-model budget policy:

- ChatGPT/Codex subscription: reserve 75% of practical usage for active-case legal analysis and filing gates, 15% for FreeLawGen legal/privacy architecture, and 10% as an unspent court-emergency reserve. Bulk ingestion, LoDs, inventories, formatting, and ordinary coding are never charged here.
- First OpenRouter pilot: fund only one $10 tranche. Allocate 40% to astar-albert/Gradient Relativity physics, 30% to Coanda-funnel carbon-capture analysis, 20% to independent legal/architecture red-team review, and 10% as reserve. Reallocate only through master-agent's logged decision when a queue is empty or a deadline is imminent.
- Give each remote run a purpose, maximum input packet, maximum output, and dollar ceiling before dispatch. One run should not consume more than 10% of the remaining monthly OpenRouter balance without Captain approval.
- Add another $10 tranche or paid agent only after the prior tranche produces a reviewed artifact that local models could not produce reliably, the role has a recurring queue, and the ledger shows that the allocation reduces—not multiplies—total cost.
- Cache reusable source packets and legal-status packets locally. Never resend the entire case corpus merely because a remote model supports a large context window.

Profile reconciliation gate: this planning session uses GPT-5.6-sol as astar-attorney, while the live `hermes profile list` still reports Gemma as the stored astar-attorney model. master-agent must decide whether GPT-5.6-sol is a session-only override or the persistent role default, apply any approved change through Hermes commands rather than hand-editing config, and verify the effective provider/model afterward. Until then, agents must report the actual model used per run rather than assume the profile label proves it.

master-agent should maintain per-profile and per-provider budgets, concurrency caps, fallback rules, and a reserve for court emergencies. Additional $10 agent allocations should be justified by a distinct durable role, measurable queue, and cheaper total cost—not merely by creating another persona.

## 13. Privacy, safety, and legal-risk controls

- Encryption in transit and at rest for hosted data.
- Organization/case authorization on every request.
- Separate public, private, sensitive, sealed, and privilege-claimed material.
- Data-retention and deletion controls with legal-hold override where applicable.
- Minimal remote-provider disclosure and configurable redaction.
- No training on user case data without separate, informed, revocable consent.
- Clear provider disclosure before sending case text remotely.
- Audit log without raw secrets or unnecessary sensitive bodies.
- Rate limits, upload limits, malware scanning, CSRF protection, request validation, and safe error handling.
- Explicit product notices: AI assistance can be wrong; filing deadlines are user/counsel responsibilities; local law changes; no guaranteed outcome.
- Accessibility, plain-language explanations, and exportability are product requirements, not polish.

Before public deployment, qualified counsel should review privacy notices, terms, unauthorized-practice-of-law risk, consumer-protection claims, data-processing agreements, records handling, and jurisdiction-specific marketing.

## 14. Infrastructure and P720 deployment

Do not promote the current P720 to production merely because the second server arrives.

### Server roles

Recommended initial split:

- Primary production P720: FreeLawGen app, authenticated MCP API, job queue, and read replicas/caches as resources permit.
- Second identical P720: staging, backup target, restore verification, model overflow, and warm recovery. It must not share a single failure domain for all backups.
- Local model hosts: isolated inference endpoints with health checks, per-model queues, context/token limits, and no direct access to unrestricted case storage.

### Production gate

- Documented OS and package baseline.
- Non-root services and least privilege.
- Firewall and private administrative network.
- TLS, authentication, secret manager, and key rotation.
- PostgreSQL backups, point-in-time recovery, and tested restore.
- Off-host encrypted backup in addition to the second P720.
- Disk, ECC, temperature, memory, database, queue, model, and application monitoring.
- Dependency lockfiles and reproducible deployment.
- Staging migration test before production migration.
- Rollback runbook.
- Capacity/load tests, including simultaneous OCR, summarization, retrieval, and exports.
- Incident response and access revocation.

Hardware capacity does not replace recovery engineering. Report measured bandwidth, latency, and throughput separately from vendor or theoretical figures.

## 15. Implementation phases and acceptance gates

### Phase 0 — Preserve and specify

- Snapshot both FreeLawGen and proving-case repositories.
- Classify current untracked/deleted/moved files.
- Replace stale FreeLawGen AGENTS instructions in a separate approved change.
- Freeze metadata, LoD, folder, provenance, and source-of-truth specifications.

Acceptance: clean restore; no unexplained deletion; schema decisions documented once for all workers.

### Phase 1 — Ingestion vertical slice

Implement one case and three source types: text PDF, DOCX, and scanned image. Produce immutable source, raw extraction, cleaned Markdown, LoD0, LoD1, LoD2, hashes, and validation state.

Acceptance: repeat ingestion is idempotent; no duplicate documents; source/output hashes and page anchors verified; no summary enters retrieval before validation.

### Phase 2 — Case package round trip

Import `McColloughVsPSU_` into staging and export it into a clean directory.

Acceptance: IDs, Markdown hashes, metadata, relationships, timeline ordering, and validated summaries survive export/import; binary sources are preserved without agents reading them.

### Phase 3 — Context engine

Build metadata filters, segmented search, progressive LoD retrieval, authority ranking, token budgets, adverse-material inclusion, and reproducible context-run logging.

Acceptance: gold questions retrieve controlling documents under budget with source anchors and no known cross-case leakage.

### Phase 4 — Read-only MCP

Expose the bounded tools in section 10 over stdio, then authenticated HTTP.

Acceptance: protocol tests, traversal/symlink tests, tenant isolation, pagination, output caps, injection containment, and context reproducibility pass.

### Phase 5 — Human review and legal drafting workflow

Add working-document generation, redlines, claim/evidence matrices, deadline review, and filing gates. Keep filing/export separate from drafting.

Acceptance: no working draft can be labeled filed; no unresolved placeholders pass the filing gate; every material proposition has a source anchor or explicit uncertainty.

### Phase 6 — GitHub/private export

Add local zip, local Git, and opt-in private GitHub creation/export.

Acceptance: privacy scan and explicit visibility confirmation; immutable manifest; clean re-import; no secret or sealed material disclosed.

### Phase 7 — Production hardening

Deploy to staging P720, run load/security/recovery tests, complete legal/privacy review, then promote through a documented change.

Acceptance: restore and rollback drills pass; monitoring and incident response work; no critical security finding remains open.

## 16. Test strategy

Add a real test stack before calling the app production-ready:

- Unit: metadata parsing, normalization, hashes, LoD invalidation, token budgeting, path containment.
- Property/fuzz: hostile filenames, YAML, Unicode, malformed documents, zip bombs, symlinks, and traversal.
- Integration: PostgreSQL migrations, import/export round trip, job idempotency, access control.
- Retrieval: gold case questions and adverse-document recall.
- MCP contract: tool schemas, caps, authorization, deterministic context receipts.
- Security: cross-tenant access, prompt injection, SSRF, upload handling, secrets, and public-repo confirmation.
- Legal workflow: holding-versus-allegation labeling, effective-date checks, deadline-source requirement, draft/filed separation.
- Recovery: database point-in-time restore and case-package rebuild.
- Accessibility: keyboard, screen reader, contrast, plain-language notices.

Use the actual Next.js 16 documentation installed under `Web/node_modules/next/dist/docs/` before implementation. Do not trust stale framework patterns.

## 17. Immediate next tasks

1. Preserve and restore-test both repositories.
2. Correct FreeLawGen's stale AGENTS.md in a dedicated task.
3. Approve the canonical folder, metadata, LoD, and provenance specifications.
4. Move or reimplement the MCP prototype under FreeLawGen with path containment and read-only tools.
5. Design Drizzle migrations for document versions, artifacts, summaries, ingestion, context runs, organizations, and audit events.
6. Create a 10–20 question McCollough gold retrieval set.
7. Implement one end-to-end ingestion/context vertical slice.
8. Establish master-agent's local-first/frontier-escalation budget ledger.
9. Run security and privacy review before any sensitive GitHub or remote-model integration.
10. Keep the Captain's rested court work ahead of infrastructure expansion.

## 18. Definition of done

FreeLawGen is ready for real users only when a new person can import a disorganized case, preserve originals, obtain verified Markdown and LoD derivatives, retrieve a reproducible and correctly scoped context packet, draft a visibly non-final document, export a portable private case repository, and understand every source and uncertainty—without exposing another case, leaking private material, inventing legal posture, or depending on an expensive frontier model for routine work.
