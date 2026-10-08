// Copyright AStarship <https://astarship.net>.
/** Court toolkit barrel — the per-country legal system rules + iterate core. */
export {
  FreedomCourtRules,
  DefaultTagPolicy,
  type TCourtRules,
  type TCourtLevelInfo,
  type ITagPolicy,
} from "./Rules"

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
} from "./Iterate"

export { CourtIterateHandler, CourtHandlerWithRules } from "./IterateHandler"

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
} from "./Filename"

export { CourtLevels, CourtByLevel, CourtOrderIndex } from "./Levels"

export { MarkdownWordCount, type TWordCountOptions, type TWordCountResult } from "./WordCount"

export { exportToPleadingPdf } from "./PleadingExporter"
