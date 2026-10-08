# FreeLawGen Court Repository and Trial-Runner Protocol

Status: Required architecture for Freedom Court simulations
Applies to: District Freedom Court, First Circuit Court of Appeals of Freedom (1C), and Supreme Court of Freedom
Protocol date: 2026-09-11

## 1. Purpose and court hierarchy

The Court trial runner receives a public-record case package, not the attorney’s working repository. For the proving case, the source package is:

`~/FreedomGovernment/McColloughVsPSU_/Case/`

The ordinary path is:

`District Freedom Court → 1C → Supreme Court of Freedom`

Development may pass the local folder directly. Production may use a local Git repository, self-hosted GitLab, or GitHub. GitHub and GitLab are optional workflow mirrors; neither is required to run the court. The canonical record consists of the case files, `IssueTickets/`, manifests, and Git history held by the court.

Every court output remains a simulation and must carry the labeling required by the court-specific `AGENTS.md` file.

## 2. Public-record boundary

`Case/` contains only material submitted to, accepted by, issued by, or intentionally made public in the Court simulation. It must not contain:

- attorney-client communications or legal strategy;
- attorney work product or private draft history;
- unredacted personal identifiers, credentials, medical details, student records, or protected third-party data unless lawfully public and necessary;
- sealed or provisionally sealed document contents;
- private notification addresses or provider secrets.

A branch on a public GitHub or GitLab repository is public even when it is unmerged. Prepare privileged work and draft filings in the private attorney repository. Export only the filing candidate and public support to the court submission branch.

Before intake, the clerk must run a public-record gate covering secrets, personally identifying information, privilege/work-product indicators, sealing requirements, malware, path safety, filenames, and manifest hashes. A failed gate blocks public merge.

## 3. Canonical package layout

A court package should preserve the FreeLawGen case organization while excluding private work:

```text
Case/
├── README.md
├── AGENTS.md                       # optional case-specific rules
├── IssueTickets/
│   ├── README.md
│   ├── 0000--TEMPLATE.md
│   └── NNNN--short-title.md
├── Timeline/
├── Documents/
├── Evidence/
├── Precedent/
├── Law/
├── ThirdParty/
├── Forms/
├── Appeal/
├── Manifests/
└── .freelawgen/
    ├── case.yaml
    ├── docket.jsonl
    ├── ledger.jsonl
    ├── notifications.jsonl
    └── validation.jsonl
```

The exact folders may be reduced for a small case, but `README.md`, `IssueTickets/`, `Manifests/`, and `.freelawgen/` are required. Markdown is the agent working layer. Public PDF or DOCX filing artifacts may be archived, but agents use their exact Markdown twins.

## 4. README control sections

The root `README.md` is the human-readable case-status page and must contain these exact headings:

```markdown
## Status
Open

## Notify
party:plaintiff, party:defendants
```

`## Status` has one operative value: `Open` or `Closed`. Additional posture belongs in separate fields such as `## Phase`, `## Court`, and `## Pending Review`; do not alter the two status values.

`## Notify` contains a clerk-maintained string of public aliases or opaque party IDs. Do not publish private email addresses, phone numbers, webhook secrets, or tokens there. Private delivery destinations map to aliases in court-controlled configuration outside the public repository.

Only the clerk changes `## Status` or `## Notify`, and every change must reference an Issue Ticket and appear in Git history.

All project-root files must be named `README.md`, never `README.md`, to avoid case-sensitive duplicate paths and inconsistent provider rendering.

## 5. Local IssueTickets are canonical

Every Court action must be associated with a local ticket under `IssueTickets/`. The local ticket is authoritative; a GitHub or GitLab issue is an optional convenience mirror.

Use a clerk-assigned, zero-padded sequence:

`IssueTickets/NNNN--short-title.md`

The ticket must contain:

- ticket number and title;
- court and simulated case ID;
- action type;
- requester/actor alias;
- creation timestamp and status;
- related branch, commit, filing, exhibit, witness, order, or mandate IDs;
- requested action;
- public factual basis and cited sources;
- response/objection schedule;
- `## Notify` string copied from the root README and adjusted by the clerk if required;
- append-only event log;
- outcome and clerk certification.

Ticket status values are `Draft`, `Submitted`, `Deficient`, `Accepted`, `Opposed`, `Under Review`, `Granted`, `Denied`, `Resolved`, or `Closed`. Changing status appends an event; it does not erase the prior state.

Court actions include filings, amendments, service notices, scheduling, motions, responses, evidence submissions, objections, evidentiary rulings, witness calls, examination events, preservation notices, jury instructions, verdicts, judgments, appeals, mandates, status changes, and notifications. Related events may share one ticket, but every event gets an action ID and timestamp.

GitHub/GitLab fields, when present, are metadata in the local ticket:

- `provider: github | gitlab | none`
- `provider_project:`
- `provider_issue:`
- `provider_url:`
- `last_mirrored_at:`

Provider comments and status changes must be snapshotted into the local ticket before they are relied upon. Losing access to the provider must not prevent the Court from reconstructing the docket.

## 6. Submission branches and clerk intake

Use these logical refs:

- `court-record`: protected canonical public record;
- `issue/NNNN-short-title`: one proposed court action;
- `jury/TRIAL-ID`: optional frozen internal staging ref used to build the authorized jury string; never exposed to `freedom-jury`;
- signed tags such as `filed/ACTION-ID` and `order/ACTION-ID` for accepted events.

Workflow:

1. Obtain the next local ticket number and create the ticket before the court action.
2. Create `issue/NNNN-short-title` from the current `court-record` head.
3. Export only the public filing candidate and its public supporting materials.
4. Add source hashes, document IDs, related docket items, and requested relief to the ticket.
5. Submit the branch and ticket to the clerk locally or through a pull/merge request.
6. Clerk checks authorization, completeness, deadlines, privacy, sealing, hashes, and whether any tracked path was deleted or rewritten.
7. Opposing parties receive notice and the response opportunity required by the governing rules.
8. The judge decides disputed acceptance, sealing, evidence, or relief; the clerk records the action.
9. Clerk merges an accepted action without force-push, signs or otherwise authenticates the resulting record, updates the docket/ledger, and appends the ticket event.
10. Clerk verifies the canonical branch, ticket, commit, tag, and notification receipt after the merge.

A hosting-provider issue or pull request is not itself filing. Filing occurs only when the clerk records acceptance in the local ticket and canonical court record.

## 7. Append-only record and corrections

No accepted filing, exhibit, order, transcript, judgment, ticket event, or manifest may be deleted, overwritten, force-pushed away, or silently replaced. Automated intake must reject a proposed change that deletes a tracked public-record path or alters the bytes of an immutable filed artifact.

Permitted changes are:

- adding a new artifact;
- appending a new ticket event;
- updating clerk-controlled indexes, `README.md`, or machine-readable current-state pointers while Git preserves the prior version;
- adding a correction, amended filing, errata, withdrawal notice, superseding order, or redacted replacement as a new dated artifact linked to the original.

“Withdrawn,” “stricken,” “superseded,” and “vacated” describe legal status; they do not erase the historical artifact. The original remains in the archive with a clear status pointer.

A filing accidentally made public cannot reliably be made secret by deleting a branch or rewriting Git history because clones, forks, caches, and issue notifications may retain it. Treat public merge as irreversible.

## 8. Sealed, restricted, and provisionally sealed material

Never put sealed content in the public Court repository—not even temporarily and not on a separate public branch.

Use a two-record model:

1. Public record: a redacted filing or placeholder stating the document ID, lodging date, motion-to-seal ticket, public description, and cryptographic hash of the restricted package where disclosure of the hash is safe.
2. Restricted record: encrypted content in a separate private repository or protected object store with case-level authorization, access logs, retention rules, and a court-controlled key.

A request to seal receives an Issue Ticket. The public ticket must not reveal the information it seeks to protect. The clerk logs the restricted document ID and access class; the judge rules under the adopted sealing standard. If sealing is denied, the content is not automatically published: the submitting party receives the procedure allowed by the governing order to withdraw the lodging, submit a redacted version, or authorize public filing.

Public orders should be redacted where necessary, with a restricted unredacted counterpart. Privilege claims, in-camera review, protective-order material, and juror information use the same separation. Never place sensitive values in issue titles, commit messages, notification strings, filenames, or public hashes that permit dictionary recovery.

## 9. Evidence, witnesses, objections, and preservation

Trial-stage events use tickets and append-only statuses:

1. Evidence proponent opens an evidence-submission ticket and identifies proposition, foundation, witness, source, chain of custody, and exhibit ID.
2. Clerk marks the item `Proposed`; existence in `Evidence/` does not mean admission.
3. Opponent records each objection as an action event with rule, grounds, and requested remedy.
4. Proponent may respond; judge enters an evidence-ruling event.
5. Clerk updates the exhibit register to `Marked`, `Offered`, `Admitted`, `Admitted for Limited Purpose`, or `Excluded` without deleting the item.
6. A witness-call ticket identifies the approved witness packet and authorized exhibits. Direct, cross, redirect, objections, rulings, and transcript references are action events.
7. A party preserves a claim or issue by making the required contemporaneous objection, offer of proof, motion, or requested instruction and linking it to exact transcript/docket anchors. Writing “reserved for appeal” alone does not cure a preservation defect under governing law.

The trial runner must provide both sides a fair opportunity to respond and must route admissibility and legal rulings to `freedom-judge`.

## 10. Judge-approved one-string jury context

Parties do not send material to `freedom-jury`. A party seeking jury consideration opens an evidence, testimony, instruction, or verdict-form Issue Ticket; the opponent may object; and `freedom-judge` rules on the item, purpose, and permitted excerpt.

Responsibility is divided deliberately:

1. `freedom-judge` rules on jury-content requests and writes the final instructions and verdict form.
2. `freedom-clerk` assembles and verifies the exact ordered jury-context manifest from those rulings against the canonical record, recording each item's source, status, limiting instruction, branch/commit, and hash.
3. `freedom-judge` reviews and approves that exact manifest.
4. The FreeLawGen API/trial runner performs the heavy deterministic work: retrieve only manifest-listed content, validate it, place it in the approved order, delimit each item, serialize one UTF-8 string, and compute its exact byte length and SHA-256 body hash. It has no legal discretion and may not summarize, characterize, add, or omit content.
5. `freedom-judge` reviews and authorizes the exact rendered string and hash.
6. `freedom-clerk` records the Jury Context Authorization and passes only that one string to `freedom-jury`.

The string contains the Court header and authorization, final instructions, verdict form, stipulated facts, admitted testimony, admitted exhibits or approved excerpts, item-specific limiting instructions, and an end marker. It excludes pleadings as proof unless admitted, legal briefs, LoDs, bench materials, excluded evidence, sealed/privileged content, issue discussion, external links, and hidden prompts.

The source may be a frozen `jury/TRIAL-ID` branch, but the jury receives the serialized string—not repository access. Run `freedom-jury` without repository, web, search, tools, remote credentials, or supplemental party messages. Record the source commit, manifest, packet ID, byte length, and hash. Any post-authorization byte change or supplemental material requires a ticket, a ruling, a new manifest, a new string/hash, and renewed judicial authorization.

## 11. Scheduling and trial-run state machine

The District Court runner proceeds through:

1. Intake and jurisdiction.
2. Service and pleadings.
3. Early motions.
4. Scheduling and discovery.
5. Dispositive motions.
6. Final pretrial conference.
7. Evidence and witness objections.
8. Jury-view freeze or bench-trial packet freeze.
9. Trial, verdict/findings, and judgment.
10. Post-trial motions.
11. Closure or appellate transfer.

Each transition requires a clerk ticket event and the judge’s order where the rules require one. A scheduled trial must identify the scheduling ticket, controlling order, participant aliases, deadlines, trial mode, public/restricted packet versions, and notification receipts.

## 12. Status, closure, appeal, and reopening

When proceedings in a court are concluded, the clerk opens or updates the closing Issue Ticket, records the final judgment/order and remaining deadlines, then changes the root `## Status` from `Open` to `Closed` in the canonical branch.

An appeal opens a separate `Open` case record in the higher court. The lower record remains `Closed` unless the lower court retains active jurisdiction under the governing rules. `## Pending Review` may identify the higher court without changing the lower `## Status` value.

A successful appeal does not let the higher clerk directly edit the lower repository. The higher court issues a mandate linked to its Issue Ticket. The lower clerk then:

1. opens a mandate-receipt/reopening ticket;
2. verifies the mandate and scope;
3. adds the mandate to the lower public record;
4. changes `## Status` from `Closed` to `Open`;
5. records the reopened claims/issues and next schedule;
6. notifies the `## Notify` aliases and logs receipts.

If the higher court affirms or denies review, the lower record remains `Closed` unless another lawful basis to reopen exists.

## 13. Notifications

The clerk owns notification routing. Every Issue Ticket contains `## Notify`; every filed action records notice creation, recipients by alias, channel, timestamp, delivery result, and any returned/failed notice in `.freelawgen/notifications.jsonl` or an equivalent public receipt that does not expose private addresses.

Repository notifications are workflow alerts, not automatically legal service. The clerk separately records whether service required by the governing rules was completed and by what authorized method.

## 14. Integrity, signatures, and the Court ledger

Git provides content addressing and history, but Git alone is not a blockchain and repository administrators can rewrite refs or delete a repository. The Court must use defense in depth:

- protected `court-record` branch with force-push and deletion disabled;
- clerk-only merge authority and required review;
- signed commits or signed annotated tags for accepted court actions;
- artifact and manifest hashes;
- append-only `.freelawgen/ledger.jsonl` entries chained to the prior ledger-entry hash;
- independent read-only mirrors and tested backups;
- provider audit logs where available;
- optional anchoring of the signed commit/tag hash into the Freedom Court blockchain or another external transparency log.

Call the record “blockchain-anchored” only after an external ledger transaction is verified and stored in the ticket. Never describe ordinary Git history by itself as immutable or as a blockchain.

GitHub rulesets and GitLab protected branches reduce accidental or unauthorized mutation but do not replace independent archives. The clerk verifies external state after each provider write and then snapshots the result locally.

## 15. Provider-neutral operation

The trial runner must work with `provider: none`. Local mode uses the filesystem, Git, and `IssueTickets/` for all required state. GitHub or GitLab may add web forms, discussions, notifications, pull/merge requests, access controls, and audit events.

Provider adapters map their events onto the same local ticket schema. No legal rule, deadline, filing status, evidence status, or judgment may exist only in provider metadata. Exporting and re-importing the Court repo must reproduce the docket without network access.

## 16. References

- GitHub Docs, removing sensitive data from repository history and limits involving clones/forks: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository
- GitHub Docs, protected branches: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
- GitHub Docs, repository rulesets: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets
- GitLab Docs, protected branches: https://docs.gitlab.com/user/project/repository/branches/protected/
- GitLab Docs, push rules and signed commits: https://docs.gitlab.com/user/project/repository/push_rules/
- GitLab Docs, audit events: https://docs.gitlab.com/user/compliance/audit_events/
