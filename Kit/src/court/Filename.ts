// Copyright AStarship <https://astarship.net>.
/**
 * Filename — docket / upload / decision filename tooling. Deterministic, shared
 * across all courts.
 *
 * PER-COUNTRY: the tag policy + filename grammar come from the country's
 * TCourtRules (Rules.ts). The shared algorithm is the skeleton; the rules are
 * the country's impl. `FreedomCourtRules` is the default (the standard docket
 * grammar + international tag policy). A country supplies its own TCourtRules
 * for a different grammar.
 *
 * Default grammar (FreedomCourtRules):
 *   docket:   YYYY-MM-DD;HH-MM-SS--<Tag>.md   (two hyphens)
 *   decision: YYYY-MM-DD;HH-MM-SS-<Title>.Decision.md  (one hyphen, CamelCase)
 */

import type { TCourtRules } from "./Rules"
import { FreedomCourtRules, type ITagPolicy } from "./Rules"

/**
 * TagPolicyFor — the tag policy for a level under the given rules. If the rules
 * give a single policy, use it; otherwise the per-level one (or the default).
 */
export function TagPolicyFor(rules: TCourtRules, level: string): ITagPolicy {
  const t = rules.tag_policies
  if (t && "re" in t) return t as ITagPolicy
  const perLevel = (t as Partial<Record<string, ITagPolicy>>)[level]
  return (perLevel ?? (FreedomCourtRules.tag_policies as ITagPolicy)) as ITagPolicy
}

/** ValidateTag — validate a user-entered tag for a level under the rules. Returns the tag or throws. */
export function ValidateTag(rules: TCourtRules, level: string, tag: string): string {
  const policy = TagPolicyFor(rules, level)
  if (!tag || !policy.re.test(tag)) {
    throw new Error(`Invalid ${level} tag "${tag}". Allowed: ${policy.description}`)
  }
  return tag
}

/** StampUtc — YYYY-MM-DD;HH-MM-SS in UTC from a Date (fixed-width, valid calendar). */
export function StampUtc(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0")
  return (
    `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}` +
    `;${p(d.getUTCHours())}-${p(d.getUTCMinutes())}-${p(d.getUTCSeconds())}`
  )
}

/** Rfc3339Utc — RFC3339 UTC ending in Z (for YAML front matter). */
export function Rfc3339Utc(d: Date): string {
  return d.toISOString().replace(/\.\d{3}Z$/, "Z")
}

/**
 * DocketFileName — build a docket/upload filename using the country's
 * `docket_template` (default: YYYY-MM-DD;HH-MM-SS--<Tag>.md).
 */
export function DocketFileName(
  d: Date,
  rules: TCourtRules,
  level: string,
  tag: string,
  ext = "md",
): string {
  const safe = ValidateTag(rules, level, tag)
  return rules.docket_template(StampUtc(d), safe, ext)
}

/**
 * CaseFolderName — build a CASE FOLDER name (no ext) using the country's
 * docket_template with an empty ext.
 */
export function CaseFolderName(d: Date, rules: TCourtRules, level: string, tag: string): string {
  const safe = ValidateTag(rules, level, tag)
  return rules.docket_template(StampUtc(d), safe, "").replace(/\.?$/, "")
}

/**
 * DecisionFileName — build a JUDGE DECISION filename using the country's
 * `decision_template` (default: YYYY-MM-DD;HH-MM-SS-<CamelTitle>.Decision.md).
 */
export function DecisionFileName(d: Date, rules: TCourtRules, camelTitle: string): string {
  if (!/^[A-Z][A-Za-z0-9]*$/.test(camelTitle)) {
    throw new Error(`Invalid decision title "${camelTitle}" (must be CamelCase)`)
  }
  return rules.decision_template(StampUtc(d), camelTitle)
}

/**
 * FIFO ordering — the court's queue comparator.
 *
 * Emergency (shadow) dockets drain FIRST, then the normal docket; within each
 * group, alphabetical ascending by full timestamp filename (oldest first).
 * Sealed status does NOT change drain order — only public visibility.
 */
export type QueueKey = "docket" | "docket_sealed" | "docket_shadow" | "docket_shadow_sealed"

function queueRank(queue: string): number {
  if (queue === "docket_shadow" || queue === "docket_shadow_sealed") return 0
  return 1
}

/** FifoComparator — the queue drain comparator (shadow first, oldest-first). */
export function FifoComparator(
  a: { queue: string; name: string },
  b: { queue: string; name: string },
): number {
  const qa = queueRank(a.queue)
  const qb = queueRank(b.queue)
  if (qa !== qb) return qa - qb
  return a.name.localeCompare(b.name)
}

/** SortFifo — sort a mixed queue list FIFO (shadow/emergency first, oldest-first). */
export function SortFifo<T extends { queue: string; name: string }>(items: readonly T[]): T[] {
  return [...items].sort(FifoComparator)
}
