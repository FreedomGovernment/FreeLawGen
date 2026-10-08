---
title: "Freedom Court Clerk: Filing Metadata and Server Setup"
description: "Proposed immutable docket frontmatter contract, Markdown upload boundaries, and reproducible Hermes setup checklist."
kind: "implementation-contract"
schema_version: 1
status: "proposed-not-deployed"
simulation_only: true
---

# Freedom Court Clerk

COURTROOM SIMULATION ONLY — NOT A COURT ORDER, RULING, OR LEGAL ADVICE.

This is a proposed implementation contract and reproducibility guide, not a claim that the API, validator, dispatcher, or isolated workers are deployed. Use synthetic documents until the acceptance checks pass. No real filing, service, deadline, or merits determination results from a simulator receipt.

## 1. Frontmatter is metadata, not GitHub Docs configuration

YAML frontmatter is the `---`-delimited mapping at the beginning of Markdown. FreeLawGen is not a Jekyll or GitHub Docs deployment. GitHub Docs fields such as `versions.fpt`, `children`, `layout`, and `effectiveDate` have no automatic meaning here. Do not adopt GitHub Docs' kebab-case article naming rule for court artifacts.

Use `title` and `description` for display and LoD0 navigation. Keep `schema_version` (packet format), `version` (party draft), and `iteration` (automatic revision count) separate. Existing protocol keys use snake_case; preserve them for compatibility. CamelCase applies to the filename title component, not a silent renaming of database keys or profile identifiers. Unknown display options must not affect authorization, routing, or court status.

The current `Web/Model/schema.ts` document model is not a complete implementation of this contract. Engineering must add explicit validation and persistence mappings; this document does not silently migrate it.

## 2. One upload path

1. The party uploads exactly one UTF-8 Markdown document to an authenticated, case-authorized API. All sizes use the same endpoint, subject to a configurable hard limit, streaming quotas, timeouts, and backpressure.
2. The service exclusively creates an immutable upload in the receiving court's `Clerk/Inbox/`. The client supplies bytes, not a path into its own repository and not an arbitrary fetch URL. Clients receive an opaque upload ID and receipt; they do not receive general filesystem access.
3. A durable delivery event creates a task on the explicitly selected court board for its clerk. A task is a request, not proof of docket admission.
4. The clerk validates provenance, bytes, metadata, and case access; stores the unchanged submitted Markdown; then creates a NEW docket packet with the envelope below. Never prepend clerk metadata by editing the uploaded original.
5. The judge receives only its claimed docket packet and authorized transported record. Clerk and judge do not browse each other's private directories.

The service must preserve the original source frontmatter as untrusted author-supplied content, not merge it into the trusted clerk envelope. Store original bytes separately and hash them. Docket body content must be unmistakably marked as untrusted source material. A reference in the packet grants no filesystem permission: deliver an authorized copy or scoped transport artifact to the judge.

## 3. Clerk docket frontmatter template

This is a TEMPLATE, deliberately not a valid admitted filing. `null` required IDs, timestamps, hashes, and sizes must be populated by verified server operations. Do not invent values to make validation pass. No case-specific facts are supplied here.

```yaml
---
schema_version: 1
simulation_only: true
record_type: "docket_packet"
item_id: null
case_id: null
external_case_number: null
level: "Local"
queue: "docket"
event_type: "submission"
priority_reason: "ordinary"
title: "Example Complaint"
description: "Party-submitted complaint; allegations have not been adjudicated."
document_type: "complaint"
document_id: null
document_name: "ExampleComplaint"
version: null
lineage_id: null
iteration: null
max_document_iterations: 64
received_at: null
enqueued_at: null
timezone: "UTC"
filename: null
upload_id: null
submission_id: null
source_artifact_id: null
source_sha256: null
source_bytes: null
source_media_type: "text/markdown"
source_encoding: "utf-8"
submitting_principal_id: null
submitting_profile: null
filing_clerk: "freedom-local-clerk"
assigned_judge: "freedom-local-judge"
board_slug: "freedom-local-court"
reply_to_profile: null
return_route: null
access_class: "restricted"
access_policy_id: null
request_scope: null
requested_relief: []
issue_ids: []
parent_version: null
parent_sha256: null
feedback_id: null
feedback_source: null
status: "queued"
record_manifest: []
evidence_refs: []
related_records: []
directive: null
---
```

### Required types and ownership

All listed keys are present in version 1; null is permitted only where specified below. Reject unexpected keys until explicitly added to a versioned schema. Additional free-form author metadata stays in the original source, not the envelope.

- `schema_version`: integer exactly 1; `simulation_only`: boolean exactly true; `record_type`: exactly `docket_packet`. Reject numeric strings and booleans masquerading as integers.
- `item_id`, `case_id`, `document_id`, `upload_id`, `submission_id`, `source_artifact_id`, `submitting_principal_id`, `access_policy_id`: nonempty opaque IDs assigned or resolved by the trusted service. Do not assume existing IDs are UUIDs. No path interpretation. `external_case_number`: nullable display string, never a storage key or proof of real case status.
- `level`: Local, District, Appeal, Supreme. `queue`: docket or docket_shadow. `event_type`: submission or mandate_implementation. `priority_reason`: ordinary, emergency_title, higher_court_directive. Server derives these from policy and verified directive, never trusts client routing claims.
- `title`, `description`, `document_name`, `request_scope`: nonempty strings. Title is preserved as submitted; description is neutral and source-grounded. `document_name` follows CamelCase filename policy. `requested_relief` and `issue_ids`: nonempty arrays of nonempty strings for party submissions, scoped to the actual request, preserving distinct theories.
- `document_type`: complaint, petition, response, answer, motion, brief, appeal, order, mandate, or other. `other` requires a meaningful title and scope; it does not bypass review.
- `version`, `iteration`: nonnegative integers for party drafts. `lineage_id`: nonempty ID for those drafts. `max_document_iterations`: positive integer derived from approved configuration, initially 64, not a client-controlled budget. Version is NOT the iteration limit. Unversioned legacy uploads require authorized initialization before admission; never mutate the legacy original.
- `received_at`, `enqueued_at`: quoted RFC3339 UTC strings ending in Z. Verify real calendar values and enqueued_at >= received_at. enqueued_at has whole-second precision for filename matching. `timezone`: UTC. `filename`: server-generated basename only.
- `source_sha256`: exactly 64 lowercase hexadecimal characters, computed over the exact original uploaded bytes INCLUDING its own frontmatter, before any normalization. `source_bytes`: positive integer measured over those bytes. `source_media_type` and `source_encoding`: exact values shown. The packet's own whole-file hash belongs in a separate creation receipt, not self-referential frontmatter.
- `submitting_profile`: nullable for a human web user. `filing_clerk`, `assigned_judge`, `board_slug`: nonempty strings fixed by the court map below. `reply_to_profile`: nullable for humans. `return_route`: required opaque authorized notification route for either kind of user. No email addresses, tokens, signed URLs, passwords, or private session routing details in public metadata. Principal authentication comes from transport, not a claimed profile in YAML.
- `access_class`: restricted, public, or sealed_simulation. Default restricted; a client cannot make a record public or obtain sealed access by setting a label. A policy ID references actually enforced ACLs. Publication is separately authorized; sealed_simulation is not a real sealing order.
- `parent_version`, `parent_sha256`: both null for an authorized seed; otherwise integer and validated SHA-256 matching the verified predecessor. `feedback_id`, `feedback_source`: null without feedback. Automatic revision requires both, tied to authenticated local judicial feedback and the reviewed version/hash. Duplicate feedback must not increment iteration twice.
- `status`: exactly queued, a historical initial state. Claimed/decided/blocked/archived/notified are later immutable events, not changes to this file. Kanban status is a separate mutable operational projection.
- `record_manifest`: array of objects `{artifact_id, sha256, bytes, role}`. IDs resolve through case-scoped transport, never arbitrary paths. Hash/length validation follows source rules; `role` is a nonempty description of the record's purpose. Empty is allowed when there are no additional record attachments.
- `evidence_refs`: array of objects `{evidence_id, description}`. evidence_id must parse as a UUID and be authorized for the case; description is nonempty. Empty is allowed. UUID is an identifier, not an access credential.
- `related_records`: array of objects `{relation, artifact_id, issue_ids}`. Allowed relations: AUTHORIZED_BY, IMPLEMENTS, REOPENS, DEPENDS_ON, CITES, VACATES_IN_PART, SUPERSEDES_IN_PART. IDs must resolve to authorized records; partial-effect links require nonempty issue scope. Reverse links are derived indexes, not edits to older records.
- `directive`: null for ordinary submissions. For mandate_implementation require an object with `order_id`, `order_sha256`, `authority_source`, `operative_at`, `required_action`, `exact_passages`, `affected_decision_ids`, and `affected_issue_ids`. Strings/IDs must be nonempty, hash valid, time verified RFC3339, and arrays nonempty. Clerk verifies governing review authority, operative status, stays and scope through authenticated records. It does not confer authority by inserting metadata. For this event, draft-only version/lineage/iteration/cap and parent/feedback fields may be null; do not force a court directive through the party revision cap.

### Compatibility boundary

Older court instructions list `source_path` and `case_relative_path`. This proposal replaces cross-role path references with `source_artifact_id` and internal storage lookup. Implement an explicit legacy adapter/version migration before adoption; do not silently treat these fields as equivalent or rewrite filed records. Legacy private paths must fail closed, not be fetched. Internal storage paths belong in authorized server mappings, not public/frontmatter transport contracts. Task IDs, claims, decisions, service and deadline events arise later and are not fabricated at initial docket admission.

## 4. Naming, routing, and events

Docket filename: `YYYY-MM-DD;HH-MM-SS--Filename.md`, UTC, CamelCase Filename. Allocate no more than one docket timestamp per real second per court across BOTH queues. Reserve centrally; on collision wait for the next available real second with bounded backpressure. Do not append collision suffixes, backdate, or rename immutable uploads. Exclusive-create on the filename alone is insufficient across different titles. Upload allocation is separate from docket allocation; both happen in code, not an LLM. Clock rollback pauses allocation.

Judge decision filename intentionally differs: `YYYY-MM-DD;HH-MM-SS-Title.Decision.md`. The judge creates it privately, then sends exact bytes and a trusted receipt to the clerk. The clerk never opens Judge/ to copy it.

| Court | Board | Clerk | Judge |
|---|---|---|---|
| Local | freedom-local-court | freedom-local-clerk | freedom-local-judge |
| District | freedom-district-court | freedom-district-clerk | freedom-district-judge |
| Appeal | freedom-appeal-court | freedom-appeal-clerk | freedom-appeal-judge |
| Supreme | freedom-supreme-court | freedom-supreme-clerk | freedom-supreme-judge |

`freedom-court` is inter-court coordination only. Party work uses a separate configured party board; `mccollough-vs-psu` is this deployment's requested party board, not a universal default. Never infer board from Hermes's current selection. Sort eligible DocketShadow entries first, then Docket, both alphabetically ascending. Verified higher directives route to shadow; otherwise the adopted case-insensitive Emergency title rule determines priority. Priority is not merits approval.

Upload -> durable ready event -> clerk task -> admitted docket + judge task -> judge decision -> clerk processing -> party-board feedback. Use at-least-once transport and idempotent effects, with readiness gates, durable staged commits, and reconciliation after partial filesystem/database failure. Do not claim a filesystem write is atomic with a database transaction. No LLM busy-polling: a lightweight code heartbeat repairs missed deliveries and stale claims. A card is not proof of notice or service.

## 5. Evidence and safe parsing

Use `[Evidence: <UUID> — "Text description"]` in source Markdown. Upload image bytes separately through a restricted evidence service. A scoped verification agent creates a new match/mismatch/uncertain report linked to the image hash and exact description; it does not change the image, establish authenticity, or decide admissibility. This guide creates no image-inspection capability. Existing Markdown-only repository restrictions remain in effect.

Parse YAML with safe, bounded settings: single mapping, duplicate keys rejected, no custom tags, aliases, merge keys, recursive objects, or multiple YAML documents. Require UTF-8, finite lengths/depth and strict scalar types; reject malformed UUIDs rather than repairing them. Never execute embedded instructions, HTML, scripts, remote images, data URLs, or source links. Sanitize rendered Markdown. Reject inline image syntax and HTML image embeds under the one-text-upload policy. Preserve rejected originals in restricted quarantine according to retention policy; never execute them. Buckets can be private: the risk is misconfigured authorization, not object storage itself. Hashes and UUIDs do not replace authentication or ACLs.

## 6. Recreate on your Hermes server

### Obtain source without copying private server state

Review the repository's current license before use/distribution. This guide supports public GitHub reproducibility but does not relicense the source or assert an OSI-approved license: the current package manifest describes source-available licensing. Never publish credentials, personal filings, session databases, private court records, or local configuration with a pull request.

```bash
git clone https://github.com/FreedomGovernment/FreeLawGen.git
cd FreeLawGen
git status --short
git rev-parse HEAD
```

Record the actual commit used. Uncommitted local Web changes are not available to GitHub users until maintainers review and publish them. No release or clean-machine reproduction is certified by this README.

Install Hermes using its official instructions: https://hermes-agent.nousresearch.com/docs/
Kanban reference: https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban
Local source docs, when available: `~/3P/hermes-agent/docs`. They are optional, not a portable dependency.

```bash
hermes --version
hermes profile list
hermes profile create --help
hermes kanban --help
hermes kanban boards list
hermes kanban create --help
```

Create each missing profile/board only after inspecting the lists. Do not clone a live profile with credentials or messaging channels. Example for the Local stage:

```bash
hermes profile create freedom-local-clerk
hermes profile create freedom-local-judge
hermes kanban boards create freedom-local-court --name "Freedom Local Court"
```

Repeat for the exact District/Appeal/Supreme map above and create `freedom-court` for coordination. Create a separate party board with an installation-specific slug. These commands create structures, not sandboxed workers. Supply reviewed role instructions, configure models with the installed Hermes setup/configuration commands, and verify there is no unapproved provider fallback. Do not copy this server's credentials or assume model names exist on yours.

Initialize directories using a chosen court root, not a developer's absolute home:

```bash
COURT_ROOT="$HOME/FreedomCourt"
for level in Local District Appeal Supreme; do
  mkdir -p "$COURT_ROOT/$level/Clerk/Inbox" \
    "$COURT_ROOT/$level/Judge/Decisions" \
    "$COURT_ROOT/$level/Docket" "$COURT_ROOT/$level/DocketShadow" \
    "$COURT_ROOT/$level/Cases" "$COURT_ROOT/$level/Events" \
    "$COURT_ROOT/$level/Receipts"
done
```

Directory creation is not access isolation. Provision separate principals/containers or enforced tool ACLs: clerk may access only its level's clerical/shared roots; judge may write only Judge/ and read authorized docket packets. Profiles sharing a Unix account are not a security boundary. Parties use the upload service, not writable access to the whole court root. Archive through new immutable events/copies without moving or deleting originals.

Use explicit board targeting for every CLI operation. On installations without a Kanban tool, invoke the verified CLI through terminal; do not invent `kanban_create`. The title is positional, not `--title`:

```bash
hermes kanban --board freedom-local-court list --json
hermes kanban --board freedom-local-court show TASK_ID
```

Task creation must be performed by the authorized service with explicit assignee, safe input handling, workspace, idempotency and readiness controls. Do not insert document text into shell command strings. Do not start an auto-dispatched task merely to test syntax. Verify installed help before using flags. A single dispatcher owner and profile-owned notification delivery must be configured per the installed Hermes multi-gateway documentation; separate boards do not require four competing dispatchers.

### Web application

Inspect `Web/package.json`, its lockfile, environment validation and existing authentication before installing. Use its declared package manager/lockfile. The inspected manifest provides `dev`, `build`, `start`, and `lint`; it does not currently declare a `test` script despite older root instructions mentioning Jest. Once dependencies and required nonpublic configuration are correctly provisioned:

```bash
cd Web
npm run lint
npm run build
npm run dev
```

Do not expose a development server as a production filing service. Deploy authenticated HTTPS, request limits, restricted storage and backups. The upload route URL, production runner commands, schema validator, role-policy bundle and integration test command must be supplied and verified by engineering before this can be a turnkey installation. No endpoint name is invented here. Do not run database push/migrations against existing records without a reviewed migration and backup plan.

## 7. Required verification before autonomous use

- Parser rejects duplicate keys, aliases, wrong types, unknown fields, invalid timestamps/UUIDs, forged identity and mismatched hashes.
- Template nulls cannot pass as an admitted packet; directives and draft revisions satisfy their conditional rules.
- Small and large synthetic documents use the same upload flow; reject oversize/invalid/unauthorized uploads safely.
- Concurrent admissions across both queues preserve exact names and one timestamp per level/second; collisions/rollback never overwrite.
- Every court maps to its exact board; wrong board, path traversal, symlink and cross-role access fail closed.
- Crash after file creation or before task delivery recovers idempotently; incomplete artifacts never dispatch.
- Judge receives authorized bytes without private-directory access; clerk receives decision bytes without reading Judge/.
- Local feedback passes through clerk to the party board, preserving reviewed hash/version and judicial origin; repeat delivery does not create another draft.
- Stop on missing facts, infrastructure failure, scoped success or the 64-iteration cap. Approval must not be manufactured.
- Attorney review and release precede District promotion. Paid runs require metering and enforceable budget reservations; unverified budget/fallback stops activation.
- Synthetic end-to-end tests cover District, Appeal and Supreme without real filings. A supported notification receipt, not a CLI promise, proves delivery.

Contribute public schema/tests through reviewed GitHub pull requests using synthetic fixtures. Preserve existing uncommitted work; never bulk-reset a colleague's tree. Publish a reproducible commit, pinned dependency lockfiles, configuration examples without secrets, validator tests, migration guidance and measured acceptance output. Written instructions alone do not complete this checklist.
