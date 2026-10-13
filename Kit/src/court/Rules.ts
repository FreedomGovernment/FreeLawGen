// Copyright AStarship <https://astarship.net>.
/**
 * Rules — a Country's legal system, expressed as config the shared library
 * consumes. The Captain's directive: "Each Country's legal system is different,
 * so think of FreeLawGen as the shared library, and each Court must make their
 * own impl."
 *
 * So the Kit (@freelawgen/court) provides the SKELETON (the deterministic
 * algorithms: iteration, filename grammar, case numbers, FIFO ordering). The
 * COUNTRY provides the RULES (TCourtRules): how many court levels, what they're
 * called, the tag charset, the filename grammar, the revision cap, the log
 * name. The same shared code runs a Local Freedom Court in the US, a tribunal
 * in France, or a corte in Brazil — each with its own TCourtRules.
 *
 * `FreedomCourtRules` below is the DEFAULT implementation (the Captain's own
 * Freedom Court). It is a starting point, not a requirement — a country that
 * wants the bare skeleton supplies its own TCourtRules.
 */

/** One court level in a country's hierarchy (e.g. "Local", "District"). */
export interface TCourtLevelInfo {
  /** Canonical level name (matches the folder under the Court root). */
  level: string
  /** Kanban board slug for this court (optional if the country has no kanban). */
  board?: string
  /** Canonical clerk profile (optional). */
  clerk?: string
  /** Canonical judge profile (optional). */
  judge?: string
  /** Web route for this court's page (CamelCase app-router route, optional). */
  route?: string
  /** Human label. */
  label: string
}

/** The tag policy for a court level (what a user may put in a docket tag). */
export interface ITagPolicy {
  /** The allowed-character regex. */
  re: RegExp
  /** Human description of the policy (for error messages). */
  description: string
}

/**
 * TCourtRules — the rules of ONE country's legal system. Inject this into the
 * Kit's functions to run them under that country's rules.
 *
 * Everything here is a rule a country may differ on. The Kit NEVER hardcodes a
 * country's law — it only knows the shape of a legal system.
 */
export interface TCourtRules {
  /** The country's court hierarchy, in ascending order. */
  levels: readonly TCourtLevelInfo[]
  /**
   * Tag policy per level (or one policy for all levels). International by
   * default (Unicode letters) so a non-English-speaking Court works out of the
   * box.
   */
  tag_policies: Partial<Record<string, ITagPolicy>> | ITagPolicy
  /** Max automatic revisions per document lineage (the "64" is a Freedom Court choice). */
  max_draft_revisions: number
  /** The per-case agentic-workflow log filename (lives with the case). */
  agent_workflow_log: string
  /** The folder name that holds a case's docs (used to locate the case log). */
  cases_folder: string
  /**
   * The docket filename template. `stamp` = YYYY-MM-DD;HH-MM-SS, `tag` = the
   * validated tag. The Freedom Court default is `stamp--tag.md` (two hyphens).
   */
  docket_template: (stamp: string, tag: string, ext: string) => string
  /**
   * The decision filename template. `stamp` = YYYY-MM-DD;HH-MM-SS, `title` =
   * the CamelCase title. Freedom Court default: `stamp-title.Decision.md`.
   */
  decision_template: (stamp: string, title: string) => string
}

/** The default international tag policy (Unicode letters + digits + _ + -, no spaces, 1–80). */
export const DefaultTagPolicy: ITagPolicy = {
  re: /^\p{L}[\p{L}\p{N}_-]{0,79}$/u,
  description:
    "International tag: Unicode letters, digits, underscore, dash. No spaces. 1–80 chars.",
}

/**
 * FreedomCourtRules — the DEFAULT implementation: the Captain's own Freedom
 * Court (4 levels, the freedom-* slugs, 64-revision cap, the standard docket
 * grammar). A country that wants the bare skeleton supplies its own TCourtRules
 * instead.
 */
export const FreedomCourtRules: TCourtRules = {
  levels: [
    {
      level: "Local",
      board: "freedom-local-court",
      clerk: "freedom-local-clerk",
      judge: "freedom-local-judge",
      route: "/Local",
      label: "Local Freedom Court",
    },
    {
      level: "District",
      board: "freedom-district-court",
      clerk: "freedom-district-clerk",
      judge: "freedom-district-judge",
      route: "/District",
      label: "District Freedom Court",
    },
    {
      level: "Appeal",
      board: "freedom-appeal-court",
      clerk: "freedom-appeal-clerk",
      judge: "freedom-appeal-judge",
      route: "/Appeal",
      label: "First Freedom Court of Appeals",
    },
    {
      level: "Supreme",
      board: "freedom-supreme-court",
      clerk: "freedom-supreme-clerk",
      judge: "freedom-supreme-judge",
      route: "/Supreme",
      label: "Supreme Freedom Court",
    },
  ],
  tag_policies: DefaultTagPolicy,
  max_draft_revisions: 64,
  agent_workflow_log: "AgentWorkflow.ndjson",
  cases_folder: "Cases",
  docket_template: (stamp, tag, ext) => `${stamp}--${tag}.${ext}`,
  decision_template: (stamp, title) => `${stamp}-${title}.Decision.md`,
}
