# Judge-Authored Immutable Decisions

COURTROOM SIMULATION ONLY — NOT A COURT ORDER, RULING, OR LEGAL ADVICE

## Authority and naming

This is the current decision-production contract for all four court levels. It supersedes earlier instructions that the judge only messages an opinion and the clerk authors its first file. Judges create decision artifacts; clerks verify, register, process, and notify. Neither role may change an existing artifact.

Decision path: ~/FreedomGovernment/FreeLawGen/Court/<Level>/Judge/Decisions/YYYY-MM-DD;HH-MM-SS-Title.Decision.md

Use the exact single hyphen before Title, literal semicolon, UTC fixed-width calendar timestamp, CamelCase Title, and .Decision.md suffix. Example title component: AllowSecondAmendedComplaint. No lower_snake_case, spaces, path separators, or shell metacharacters in Title. Validate title with [A-Z][A-Za-z0-9]* plus the application's CamelCase convention. Preserve the full natural-language title in YAML. Do not rename existing artifacts. New artifact title components throughout this workflow use CamelCase; existing YAML keys, opaque IDs, profile names, and logical queue names remain unchanged to avoid breaking contracts. Docket submissions retain their separately specified double-hyphen timestamp separator; this single-hyphen format is specifically for decisions.

## Judge creates first

1. Accept an exclusively claimed docket item; verify case, claim, reviewed draft version/hash, authority and scope. Read only the authorized record. Analyze each issue under the proper standard and write reasons, disposition, any revision instructions, and the next authorized procedural step. An unavailable record is not permission to invent evidence or a favorable ruling.
2. Prepare the complete UTF-8 decision in memory. Include YAML: schema_version, simulation_only, decision_id, case_id, item_id, claim_id, judge_profile, judge_session_id, source_version, source_sha256, created_at, timezone, title, disposition, success_scope, revision_requested, affected_issue_ids, authority_links, next_steps, and intended_recipient_aliases. Each next step identifies its actor and authority; any deadline requires the verified trigger/rule or is marked unverified. Include the simulation label in the body.
3. Through an authenticated judge-only create tool, reserve a unique decision timestamp per level and exclusively create the completed file. Reject symlink/path escapes, collisions, and attempts to overwrite. Do not use an overwrite-capable writer after merely checking existence. Never truncate a prior or partial artifact; a failed write is an integrity incident requiring new recovery metadata. Do not notify the clerk of a partial/unverified decision.
4. Read back the exact file, validate YAML and source/claim links, compute byte length and SHA-256 with code, and obtain a durable creation receipt from the storage service. Do not place a self-referential whole-file hash inside the hashed file. The receipt/message carries the hash. Trusted storage must validate durable completion before exposing an artifact as ready.
5. Send DecisionReady to the corresponding clerk ONLY AFTER successful verification. Include the exact decision path, decision ID, SHA-256, byte length, case/item/claim IDs, reviewed version/hash, and authenticated creation receipt. The file is authoritative for the opinion text; a message summary cannot replace or modify it. Obtain acknowledgement. On lost delivery, resend the same reference idempotently; never generate another ruling merely because transport failed.

## Clerk processes and notifies

Authenticate the judge/creation receipt and message, read the exact referenced file from the approved level, verify hash/bytes and matching docket claim/source version, and reject untrusted paths or mismatches. A filename and hash alone do not prove authorship.

Create a byte-identical case-record copy in Cases/<case_id>/Opinions/ with the same decision basename, then verify it. Do not reconstruct or edit the judge's prose. Create a separate immutable Decided event linking both paths/hashes; preserve the original decision and docket item. Complete the existing case-copy/archive-event procedure idempotently. Decision artifacts and notification events are not new adjudication queue submissions.

Notify the appropriate authorized parties/agents of the recorded decision and next procedural steps, preserving the judge's scope, conditions, and deadline qualifications. Record notification attempts and acknowledgements as separate new CamelCase-named event files. Pending delivery is not notice or service. Do not invent deadlines, decide merits, expand relief, or directly substitute a clerk's opinion. Local deficiency feedback goes to the owning legal-aid agent; favorable local completion follows the established astar-attorney return route and District release gate.

## Correction and security

Only the judge may issue a substantive correction as a NEW timestamped CamelCase .Decision.md file with a supersedes/corrects link and affected scope. The clerk records and notifies without overwriting either version. Mandatory higher-court implementation uses this same judge-write-then-message procedure. All existing cap, privacy, one-string jury, and dependency-scope rules remain.

CamelCase is a naming convention, not a security boundary. Tool/service permissions must restrict decision creation to the authenticated judge principal, deny update/delete, and prevent clerks or other agents from impersonating that principal. Profiles sharing one Unix account are not isolated merely by SOUL.md. Hashes detect changes only relative to a trusted receipt. Require a single validated commit per claim, idempotent retries, durable writes, case ACLs, and crash-recovery checks before unattended use. These are implementation requirements, not a claim that secure writer tools already exist.
