// Copyright AStarship <https://astarship.net>.
/**
 * @freelawgen/court — the open-source shared legal-system SKELETON.
 *
 * The Captain's doctrine: "Each Country's legal system is different, so think of
 * FreeLawGen as the shared library, and each Court must make their own impl."
 *
 * So this package provides the DETERMINISTIC ALGORITHMS (the skeleton):
 * document iteration, filename grammar, case numbers, FIFO queue ordering. The
 * COUNTRY provides its RULES (TCourtRules): its court hierarchy, tag policy,
 * revision cap, log name, filename templates. `FreedomCourtRules` is the default
 * impl (the Captain's Freedom Court); any country supplies its own TCourtRules.
 *
 * portable to any machine/country. The open-source Court is for the whole
 * world, for regular people defending themselves in court and for States
 * building their own systems — not for attorneys to commercialize.
 *
 * Licensed under the AStartup Strong Source-available License (see LICENSE).
 * Node >= 20. No hardcoded home dir — a Court is a folder + config.
 */

// Rules: the country's legal system (the per-country impl on the skeleton).
export {
  FreedomCourtRules,
  DefaultTagPolicy,
  type TCourtRules,
  type TCourtLevelInfo,
  type ITagPolicy,
} from "./court/Rules"

// Iterate: the deterministic create-only increment + per-case log.
export {
  CourtIterate,
  CourtIterateError,
  CourtResolvePath,
  CourtRoot,
  COURT_MAX_DRAFT_REVISIONS,
  COURT_DRAFT_RE,
  type TCourtConfig,
  type TCourtIterateConfig,
  type TCourtFailedDocument,
  type TCourtIterateRecord,
} from "./court/Iterate"

// IterateHandler: the shared HTTP handler (both endpoints use this one).
export { CourtIterateHandler, CourtHandlerWithRules } from "./court/IterateHandler"

// Filename: the country's filename grammar (tag policy + templates + FIFO).
export {
  ValidateTag,
  TagPolicyFor,
  StampUtc,
  Rfc3339Utc,
  DocketFileName,
  CaseFolderName,
  DecisionFileName,
  FifoComparator,
  SortFifo,
  type QueueKey,
} from "./court/Filename"

// Levels: accessors over the country's court hierarchy.
export { CourtLevels, CourtByLevel, CourtOrderIndex } from "./court/Levels"

// CaseNumber: the 64-bit SubsecondId case-number namespace (shared).
export {
  ServerIdFromSecret,
  InitCaseNumberMinter,
  CaseNumberNew,
  EnsureCaseNumberMinter,
  CaseNumberSource,
  CaseNumberIsHot,
  CaseNumberWindowSeconds,
  CaseNumberUnixSeconds,
  CaseNumberToHex,
  CaseNumberToSigned,
  CaseNumberToUnsigned,
  SignedToHex,
  CaseNumberFromHex,
  CaseNumberToDisplay,
  CaseNumberWindowId,
} from "./subsecond/CaseNumber"

export * from './court/PleadingExporter';

// Read-only, deterministic Markdown word counts; no court-specific exclusions.
export { MarkdownWordCount, type TWordCountOptions, type TWordCountResult } from "./court/WordCount"
