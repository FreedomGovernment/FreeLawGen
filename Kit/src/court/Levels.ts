// Copyright AStarship <https://astarship.net>.
/**
 * Levels — accessors over a country's court hierarchy (from its TCourtRules).
 *
 * The hierarchy itself (how many levels, their names, slugs) is the COUNTRY's
 * rule (Rules.ts). These are thin helpers to look a level up by name under the
 * given rules. `FreedomCourtRules` (4 levels) is the default.
 */

import type { TCourtRules, TCourtLevelInfo } from "./Rules"
import { FreedomCourtRules } from "./Rules"

/** CourtLevels — the country's levels (default: FreedomCourtRules, 4 levels). */
export function CourtLevels(rules?: TCourtRules): readonly TCourtLevelInfo[] {
  return (rules ?? FreedomCourtRules).levels
}

/**
 * CourtByLevel — look up a court level's info by name under the rules.
 * Returns undefined if the country's rules have no level by that name.
 */
export function CourtByLevel(rules: TCourtRules | undefined, level: string): TCourtLevelInfo | undefined {
  return (rules ?? FreedomCourtRules).levels.find((l) => l.level === level)
}

/**
 * CourtOrderIndex — the ascending rank of a level under the rules
 * (lower = earlier in the appeal path). -1 if the country has no such level.
 */
export function CourtOrderIndex(rules: TCourtRules | undefined, level: string): number {
  const idx = (rules ?? FreedomCourtRules).levels.findIndex((l) => l.level === level)
  return idx
}
