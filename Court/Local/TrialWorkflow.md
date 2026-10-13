# Local civil simulation: intake to notice of appeal

COURTROOM SIMULATION ONLY — NOT A COURT ORDER, RULING, OR LEGAL ADVICE.

This is the current user-directed Local workflow, superseding older Local routing instructions where they conflict. It is a protocol, not a deployed runner. Standing identities and permissions belong in profile SOUL.md; workspace specifics belong in Local/Clerk/AGENT.md and Local/Judge/AGENT.md. Profile-side AGENT.md copies are legacy, not additional sources of authority. Provide governance as trusted launcher configuration when filesystem isolation excludes its location.

## Ownership and docket

Keep one immutable chronological case record under Local/Cases/<case_id>/ and separate pending work queues Docket/ and DocketShadow/. Do not alternate DocketA/DocketB. Existing explicit ordering remains shadow then ordinary, alphabetical ascending; calling it FILO does not silently reverse it. Judge decides referred issues, never moves or archives records. Clerk manages records, never decides evidence sufficiency or merits. A docket is the chronological case record, not merely a directory of pending complaints.

Each task requires case, stage, document ID/version/hash, recipient, explicit board, correlation and idempotency key. Local court tasks use local-court, not freedom-court. Transport and filesystem ACLs must enforce permissions; shared Unix identity is not isolation.

## State progression

1. Party uploads Markdown through the verified Next.js API. Receiving upload storage is Local/Clerk/Inbox/ pending engineering's actual configured upload root. Do not guess an endpoint or read sender repository paths. API assigns timestamps and hashes deterministically and notifies clerk only after durable completion. No split by document size.
2. Clerk performs mechanical safe intake only: authorized case, complete UTF-8 Markdown, verified bytes and no dangerous path. It does not reject for lacking evidence, legal sufficiency, or likelihood of success. At this prototype stage there is no discretionary clerical content screening. Malformed/unsafe transport remains blocked, not accepted blindly. Copy into the proper docket with exact UTC YYYY-MM-DD;HH-MM-SS--Filename.md and immutable receipt/event; preserve original. Logical movement is verified copying plus archival state, not deleting or overwriting.
3. Clerk sends judge the claimed complaint/petition packet and any filed appellate/remand material. Judge first checks governing operative directives, then decides only the referred pleading-readiness issues under the appropriate stage standard. Clerk must request missing governing material from the authorized party, not browse its repository. A memorandum alone does not prove mandate issuance, current operative status or blanket leave to amend.
4. Judge creates an immutable decision and transmits its bytes and receipt to clerk. Judge does not move docket files. If deficiencies require a revision, clerk relays authenticated feedback to the filing party; preserve lineage and the existing 64-revision cap. No loop may manufacture approval.
5. Only after judicial permission to proceed does clerk notify red-team-legal-aid to submit a response through the same API. Prior actual defense filings may be supplied as historical sources, not misrepresented as an actual answer to a new draft. Clerk mechanically admits the response; disputed legal issues remain for judge.
6. With complaint and response recorded, clerk prepares a new isolated trial workspace, copies both unchanged, and sends judge a start-trial message. This is an expressly simplified simulation, not the real civil litigation schedule. Discovery, evidentiary disputes and other omitted proceedings are not deemed satisfied in real life.
7. Judge sends both parties evidence-submission requests. This is a limited express exception to older blanket prohibitions on judge-party messaging: scheduling/evidence/witness directions only, copied or logged for both sides and clerk. Parties deposit authorized evidence through scoped upload tools into their respective trial-side areas and separately report completion. Do not grant general write access to the other's folder or unrelated trials.
8. Wait for both evidence-completion receipts for this trial and manifest version. Judge sends red-team-attorney the shared authorized trial packet for review, not plaintiff private strategy. Its review is advocacy, not a ruling; preserve it in the shared record and give the other side a fair opportunity to address it. Missing completion or review creates a pending stage, not assumed completion.
9. Judge calls astar-witness first, then red-team-witness. Each receives only its authorized witness-knowledge packet, creates its side's Witness.md once, and returns a verified completion message. Role-play testimony is labeled simulated, never attributed to a real person as sworn testimony. Missing personal knowledge is unknown, not invented. Repeat testimony requires a new linked artifact, not replacement.
10. After both sides' submissions and witness-completion receipts, judge reviews the authorized trial manifest, including both sides, resolves evidentiary/issue scope explicitly and creates Decision.md once within that trial workspace. Evidence excluded from consideration remains preserved and identified. Decision identifies issues, reasons, source pinpoints, disposition and unresolved questions. Judge transmits decision to clerk.
11. Clerk verifies copies into the permanent case timeline: a standalone YYYY-MM-DD;HH-MM-SS-Decision.md and a linked trial archive containing all Markdown artifacts and a hash manifest. Preserve working originals. Readers can start from the decision/LoD and retrieve the trial record only as needed; summaries are not evidence and canonical LoDs remain owned by legal-assistant.
12. Clerk notifies both legal-aid agents. Each assesses whether to appeal; an authorized simulated appeal is uploaded as NoticeOfAppeal.md through intake, with the challenged decision identified. Do not infer real appealability, deadlines or authority from simulator output; do not automatically invoke paid appellate models. Further Court Orders workflow is deferred.

## Trial namespace decisions still required

The requested base is Local/Courtroom/. Do not reuse a single Witness.md or Decision.md across cases/trials. Before enabling repeated trials, engineering must use an approved case/trial-isolated namespace or equivalent isolated filesystem mount. No live trial is started by this file.

The user supplied both `Plaintff` and `Plaintiff`. Preserve this discrepancy for confirmation; the later witness paths explicitly use Plaintiff/Witness.md and Defendant/Witness.md. Do not create divergent directories or silently normalize submitted paths.

The requested trial archive name `YYYY-MM-DD;HH-SS-HH-Trial` repeats hours and lacks minutes. Do not silently repair it or use it in production. Proposed correction for approval: `YYYY-MM-DD;HH-MM-SS-Trial`. Decision timeline format is explicitly `YYYY-MM-DD;HH-MM-SS-Decision.md`, distinct from earlier .Decision.md judicial-artifact naming. Keep both naming purposes separate.

## Source and access controls

The July memorandum must enter the court through the authorized upload route; its presence in a private repository is not a filed simulation artifact. No API upload or docketing is asserted here. Court actors may not use repository paths in source notes as access grants.

Red-team public-record retrieval is limited to an approved public-file manifest drawn from the two expressly authorized Timeline roots. No broad recursive access, symlink escapes, draft/strategy ingestion, binary parsing, or repository edits. A public-folder label is not sufficient when the owner is unsure of its contents. Await review of uncertain files; do not send them to another provider. No real court filing, publication, deletion, commit or push is authorized by this protocol.
