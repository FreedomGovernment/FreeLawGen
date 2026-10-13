---
title: "Local Freedom Court Rules"
description: "Court-specific U.S. federal civil simulation baseline and sourced procedure; not a deployed legal rule engine."
schema_version: 1
simulation_only: true
source_index_checked_at: "2026-09-16"
---

# Local Freedom Court — Court Rules

COURTROOM SIMULATION ONLY — LOCAL-MODEL REHEARSAL, NOT AN ADDITIONAL U.S. COURT.

## Court identity and governing procedure

Board: local-court. Canonical clerk: local-clerk. Judge: local-judge. Local identifies inference deployment and rehearsal, not geographic or superior jurisdiction. The legacy freedom-clerk profile needs an explicitly authorized compatibility mapping before it can act as this clerk; never run duplicate consumers by assumption.

This stage adopts the District civil-law baseline (FRCP, applicable Federal Rules of Evidence, relevant jurisdictional statutes and selected local rules) for pleading and trial rehearsals. The launcher supplies the District rule baseline as trusted configuration rather than granting Local agents filesystem access to District/. A transition from Local to District is internal review escalation, not a real statutory appeal.

## Draft admission and scoped rehearsal review

Local Court accepts unfinished pleadings for authorized rehearsal. A `WORKING DRAFT NOT FOR FILING` banner, source-limited scope note, unsigned signature block, editorial appendix, or bracketed placeholder is NOT by itself a reason to reject Local intake or refuse substantive review. Preserve these warnings and the original bytes: they prevent accidental real filing. They do not prohibit simulation. Read first-person and third-person pro se allegations on their substance; neither voice is a defect or evidence of representation by counsel.

Keep three determinations separate in every pleading-review output:

- **Local admission:** eligible for rehearsal, or blocked for an identified intake, authorization, access, or integrity defect. Clerk owns mechanical admission; judge does not turn an adverse merits assessment into rejection of receipt.
- **Issue-specific review:** for each referred issue, state sufficient for the identified simulated stage, deficient with reasons, deferred for a specified missing item, or outside scope. A missing fact can prevent a favorable sufficiency finding on the affected count without preventing useful review of other counts. Do not require trial proof at the pleading stage, treat placeholders as facts, or infer that an unopposed theory is established law.
- **Real-court filing readiness:** not certified by Local simulation; identify outstanding real-filing checks separately. Never use an unqualified `Not Filable` disposition to mean both unfinished for actual filing and inadmissible for rehearsal.

Missing orders block only decisions that depend on their contents: for example, actual amendment authority or mandate implementation. Continue an expressly hypothetical merits or drafting review when that is the authorized task. Do not invent a remand order or call an appellate panel-rehearing disposition a district-court rehearing disposition. Name the tribunal, document, and exact decision it prevents.

For each material placeholder, give the paragraph/issue, information needed, why it matters, and which decision remains possible without it. Ask the party for facts or request authorized records through the clerk; never direct legal aid to fabricate or simply populate missing facts. If the human is manually editing a draft, do not authorize automatic changes to that file; provide feedback and wait for an expressly submitted successor version.

Use this disposition structure for a readable but incomplete draft:

    Local admission: Eligible for rehearsal (subject to verified intake).
    Review: Completed for identified issues; specified issues deferred or deficient.
    Real-court filing readiness: Not certified; outstanding checks listed separately.
    Next action: Clerk records the review and routes the identified questions.

This is an output contract, not a claim that API status fields or runtime validators implement it. A drafted `MESSAGE TO` block is not a sent message. Route judicial feedback through the clerk using the authorized authenticated transport, not directly to legal aid; report delivery only with an actual receipt. This rule does not order a favorable ruling or waive legal sufficiency requirements.

## Proceeding workflow

1. Follow Local/TrialWorkflow.md for the requested simplified upload, clerk admission, judicial pleading review, defense response and trial sequence, subject to the legal-versus-rehearsal distinction in these rules.
2. Clerk checks mechanical safe intake, not whether allegations win. Judge checks any filed operative higher directive before deciding the referred pleading question; a source in a party repository is not a filed docket artifact.
3. Revision feedback travels through clerk and preserves version, hash, lineage and judicial origin. Apply the configured 64 automatic-revision cap. Stop on missing facts, blocked transport, completion or cap; never optimize toward a predetermined favorable ruling.
4. After permission to proceed, obtain defense response and give both sides an authorized opportunity to submit evidence. The simplified courtroom stage omits real-life procedures only when explicitly labeled; it does not certify service, discovery or trial readiness in an actual case.
5. Repeated proceedings need isolated case/trial namespaces. Resolve the open Plaintiff/Plaintff and trial-archive timestamp discrepancies recorded in TrialWorkflow.md before creating live trial artifacts. Never overwrite Witness.md or Decision.md from another trial.
6. Judge decides only the referred questions, records reasons and limitations, and sends the decision to clerk for immutable recordkeeping and bilateral notification. Any simulated NoticeOfAppeal is assessed on its actual target and authorized route, not automatically sent to a paid model.
7. Favorable Local readiness returns to astar-attorney for review of the exact draft before District-stage release. Separately, an adverse Local decision may be challenged through the simulated appeal procedure below; that route does not require a favorable Local outcome. Both routes retain authorization, privacy and spending controls. No simulation certifies real filing readiness, recovery or damages.

The complaint's preparation and real procedural-status check take priority over adding further simulator features. Nothing here delays or extends a real deadline.

## Appeal Rules — Local to District

### Adopted simulation route

The court sequence is Local Freedom Court → District Freedom Court → First Freedom Court of Appeals → Supreme Freedom Court. Local means local-LLM rehearsal. Local-to-District is a deliberately created simulation appeal, not a real federal statutory appeal. The First Freedom Court of Appeals is the simulator's Appeal stage, not the real First Circuit. Its workspace remains Appeal/ and its board remains appeal-court.

### 1. Notice belongs on the originating Local docket

A party seeking review of a Local decision submits NoticeOfAppeal.md through the authenticated Markdown upload API to local-clerk on local-court. The clerk records the notice in the SAME Local case's permanent chronological docket, with a server-generated YYYY-MM-DD;HH-MM-SS--NoticeOfAppeal.md artifact name and a new immutable event. Preserve the original upload. Neither party nor judge directly writes or moves docket records.

The notice must identify the appellant, Local case ID, challenged decision ID/hash and entry event, the issues or scope challenged, requested relief, District Freedom Court as receiving court, and an authorized return route. Preserve source versions and lineage. The API derives identity and case permissions from authenticated transport; party-written YAML is not proof of authority. A notice is distinct from the appellate brief, petition or other receiving-court submission.

### 2. Clerk records and transmits; judge does not veto review

Clerk performs mechanical intake, not a merits prediction. An adverse Local result is not grounds to reject its notice of appeal. Any disputed reviewability or legal sufficiency question goes to the authorized reviewing judge. A general favorable-local-readiness requirement does not bar this separate appeal path. This exception does not waive provider/disclosure approval, budget controls or the human/attorney release required to activate the next stage.

Record notice receipt, docket entry, transmission, receiving-court acknowledgement and reviewing-case ID as separate events. Send an authenticated clerk-to-clerk record packet to district-clerk using district-court. Include the notice, challenged decision, relevant pleadings, authorized trial/record manifest and hashes, applicable rule versions and unresolved record gaps. Transmit bytes or authorized transport artifacts, never a path into a private repository or another role's private folder. Duplicate delivery must not create a second appeal. The Local original remains immutable.

### 3. Receiving-court filing and review

After notice docketing, the appellant submits the receiving-stage brief/petition or requested document through the District intake API under District/CourtRules.md, linking the originating notice and decision. This is not a shortcut directly from Local to Appeal/. Clerk assigns receiving case/item IDs and verifies receipt; no model may invent successful transfer.

Before merits dispatch, the District judge identifies the authorized review questions, governing simulation authority, record limits and standard of review. District's ordinary trial baseline must not silently turn this special Local appeal into a new trial or erase the adverse Local decision. If the special review standard or receiving-stage requirements are not yet defined, record a procedural clarification request rather than improvising a standard. Filing a notice alone does not stay the decision or create a victory.

No Local appeal deadline is invented here or borrowed automatically from FRAP. A time limit requires an expressly adopted simulation rule or operative order with verified computation. Real-world filing deadlines remain entirely separate and are not tolled by this simulation.

### 4. Further review — route map, not replacement rulebooks

- After a District decision, file a new NoticeOfAppeal with the District clerk in that originating case, then submit the authorized appellate filing to the First Freedom Court of Appeals through appeal-clerk under Appeal/CourtRules.md. Preserve the prior record and identify the particular District decision challenged.
- After an Appeal judgment, the user adopts an additional simulated NoticeOfAppeal on the Appeal docket before a petition for a writ of certiorari is submitted to supreme-clerk under Supreme/CourtRules.md. This extra notice is a simulation tracking step, not a claim that ordinary real U.S. certiorari requires such a notice. The party petitions for the writ; it does not issue its own writ. Supreme review remains a separate review-selection decision, not an automatic grant or new trial.
- Supreme is the terminal judicial tier of this simulator. Any authorized rehearing or correction is governed by its own rules; there is no invented higher court. Denial of certiorari is not approval of the lower court's reasoning. Finality and downstream effect must be recorded accurately.

This section establishes the Local originating procedure and records the intended overall route. Receiving-court-specific forms, review standards and any additional rules must be harmonized in their respective CourtRules.md before unattended cross-tier operation. Do not claim this Local edit implemented those endpoints or changed other courts' files.

### 5. Legislative/activism handoff is separate

After judicial avenues are concluded, a user may separately authorize an educational Freedom Government activism simulation addressing prospective law reform. It is not a court of appeal, cannot vacate a judgment, does not reopen deadlines, and does not authorize real campaigning, publication or disclosure. Preserve the completed judicial record; export only an approved, minimized or redacted packet. No automatic transfer of private case files.

## Common authority and limits

This is a civil judicial SIMULATION, not a United States court. The user adopts the U.S. Constitution and applicable federal statutes as the substantive baseline for the U.S. federal simulation. This adoption supplies a modeling framework, not governmental power or jurisdiction. Identify actual subject-matter and appellate jurisdiction, governing substantive law, controlling precedent, and the operative procedural rules for each case. Relevant state law may also apply; do not assume all disputes are exclusively federal.

Order of application: Constitution; applicable valid statutes and controlling judicial interpretations; applicable valid national procedural/evidence rules; compatible adopted local rules; lawful case-specific orders. Resolve conflicts by the actual governing law, not a simplistic file order. Case orders cannot override superior law merely by being newer. Local instructions cannot enlarge statutory jurisdiction or alter substantive rights. See 28 U.S.C. §§ 2071–2072. Rulemaking authority, appellate reversal, and mandate implementation are different acts: a higher court does not informally edit every lower court's rules.

Each court owns its rules through reviewed, versioned changes. Preserve the governing rule version for each proceeding, effective dates, amendments, and case-specific applicability. Never overwrite historical rulings to reflect a later rule. A verified operative higher-court directive controls within its scope; a remand does not automatically approve every claim or amendment. Missing mandate, stay status, or operative order is a specific record gap, not invented authority.

## Source register and effective-date discipline

- U.S. Constitution: https://constitution.congress.gov/constitution/
- Federal statutes: https://uscode.house.gov/ (consult the applicable provision and currency notes).
- National rules and effective amendments: https://www.uscourts.gov/forms-rules/current-rules-practice-procedure
- Supreme Court rules: https://www.supremecourt.gov/filingandrules/rules_guidance.aspx
- Rulemaking authority text: https://www.law.cornell.edu/uscode/text/28/2071 and https://www.law.cornell.edu/uscode/text/28/2072

The official national-rules index inspected for this draft lists December 1, 2025 amendments, including Appellate Rules 6 and 39, Civil Rules 16 and 26, and new Civil Rule 16.1. The Supreme Court's official index lists rules effective March 16, 2026. Index verification is NOT verification of every rule's complete text. Read the operative text and amendments before applying a rule, limit or deadline; proposed future changes are not automatically effective. These files summarize and incorporate source rules by reference; they do not reproduce the complete federal rulebooks. Use approved Markdown rule copies where the environment requires Markdown-only reading; missing copies block the affected computation rather than authorizing binary extraction.

Every deadline record must include the exact rule/subsection or order, triggering event, verified date/timezone, counting method, holidays, tolling/stays/extensions, result and verification state. Never infer a real deadline from a filename or the date of an opinion alone. Real filing decisions require authoritative docket verification and qualified local counsel review where available.

## Engineering rules are not procedural law

One authenticated Markdown upload path; deterministic timestamps/hashes; immutable originals; clerk-managed records; judge-owned decisions. Pending work queues are not the permanent case docket. No alternating daily docket folders. Retain one chronological case record and derive pending status from events. Shared scheduling convention: DocketShadow then Docket, alphabetical ascending (oldest timestamp first). This is an engineering convention, not a federal rule; do not reverse it merely because a prompt calls it FILO.

Clerk performs safe mechanical intake, not merits screening. Judge rules only on referred questions using the proper stage standard. No private-folder browsing, forged notice, fabricated testimony, or unapproved provider transfer. Authenticate directive and decision transmissions; filenames, profile titles and hashes alone do not establish authority. Copies and archive events preserve originals; no destructive moves. Courtrooms must be case/trial-isolated before repeat runs. Witness role-play is not real sworn testimony.

A simplified rehearsal that skips discovery, service or other stages must be labeled as such and cannot certify those real requirements satisfied. The Local trial protocol does not transform appeals into trials. No autonomous appeal, paid-model escalation, or real-world filing follows merely from a simulated loss or success. Pause for required authorization, budget, missing evidence, unresolved scope or the configured iteration cap.

## Portability to other legal systems

Separate storage/transport from jurisdiction configuration. A jurisdiction bundle must identify country, court, court hierarchy, matter type, official language, constitutional/statutory sources, national and local procedures, precedent treatment, review routes, evidence rules, party/judicial roles, deadlines, effective dates and authoritative translations. Civil-law systems are not one uniform procedure. Do not impose U.S. adversarial witnesses, discovery, juries or precedent rules on a country that uses different institutions. A folder rename alone is not a jurisdiction adapter. Unknown foreign rules remain unsupported until sourced and reviewed.

## Adoption and runtime gate

This court-specific baseline is written at the user's request. It does not amend profile permissions, start workers, establish an API, or prove a working simulation. The launcher must supply this file and the relevant source-rule manifest as trusted governance; role agents may not use links as permission to browse other courts. Test routing, role scope, immutable writes, deadlines and staged dispositions with synthetic cases before activation. Do not let simulator infrastructure delay verification and preparation of an actual filing.
