// Copyright AStarship <https://astarship.net>.
/**
 * CaseNumber — Freedom Court case numbers, built on the canonical
 * `@astarship/subsecond-id` (64-bit SubsecondId / SSD Hot UUID).
 *
 * A case number is a 64-bit SubsecondId Hot UUID:
 *   [1-bit MSb | 27-bit seconds | 8-bit ticker | 28-bit source]
 *
 *   - seconds : time-ordered (rolling 4.25-year window, see SsIdWindowStart)
 *   - ticker  : subsecond sequence (0..255) for intra-second uniqueness
 *   - source  : the issuing Court server's 28-bit identity → provenance
 *
 * The 64-bit value is the Postgres `bigint` primary key (fastest SQL lookup)
 * AND a self-authenticating legal timestamp: from the id alone you can tell
 * which server minted the case and roughly when.
 *
 * Archive lifecycle (Hot → Cold / Evergreen) per the SubsecondId spec: a case
 * stays Hot while active, then is converted to Cold before the 4-year window
 * rolls over. (Cold/Evergreen conversion is a SubsecondDb concern; the Hot
 * value is what we store and serve.)
 *
 * NOTE: `@astarship/subsecond-id` is a public dep; its `SsIdNext` was fixed
 * 2026-09-14 to (1) use a rolling 4.25-year seconds window instead of a lower-
 * 27-bit mask (which wrapped and broke monotonicity), and (2) use a stable
 * configured source identity instead of a fresh random source per call (which
 * broke provenance). See Tests/CaseNumber.test.ts.
 */

import { createHash } from "node:crypto"
import type { SsId } from "@astarship/subsecond-id"
import {
  SsIdNext,
  SsIdSetSource,
  SsIdGetSource,
  SsIdUnpack,
  SsIdSource,
  SsIdMsb,
  SsIdWindowStart,
  SsIdWindowCount,
  SubsecondIdSourceMax,
} from "@astarship/subsecond-id"

/**
 * ServerIdFromSecret — derive a stable 28-bit server identity from a secret.
 *
 * Each Court monolith holds a secret (env FREEDOM_COURT_SERVER_ID). We hash it
 * and keep 28 bits so the same server always mints ids with the same embedded
 * origin, while an attacker without the secret cannot forge that server's ids.
 * 2^28 = 268 million possible servers.
 */
export function ServerIdFromSecret(secret: string): number {
  const h = createHash("sha256").update(secret).digest()
  // 28 bits = top 4 bytes (32) masked to 28.
  return h.readUInt32BE(0) >>> 4
}

/**
 * InitCaseNumberMinter — initialize the case-number minter for this server.
 * Call once at startup. Reads FREEDOM_COURT_SERVER_ID (env or provided record).
 * If unset, mints a temporary identity and logs a warning (ids remain valid
 * but not stable across restarts until a secret is configured).
 */
export function InitCaseNumberMinter(
  env?: Record<string, string | undefined>,
): number {
  const secret = env?.FREEDOM_COURT_SERVER_ID ?? process.env.FREEDOM_COURT_SERVER_ID
  if (!secret) {
    console.error(
      "[Court] No FREEDOM_COURT_SERVER_ID set; minting a temporary " +
        "server identity. Set FREEDOM_COURT_SERVER_ID to keep it stable.",
    )
    SsIdSetSource(Math.floor(Math.random() * (SubsecondIdSourceMax + 1)))
  } else {
    SsIdSetSource(ServerIdFromSecret(secret))
  }
  return SsIdGetSource()
}

/** CaseNumberNew — mint a new court case number (64-bit SubsecondId Hot UUID). */
export function CaseNumberNew(): SsId {
  return SsIdNext()
}

/**
 * EnsureCaseNumberMinter — ensure the minter is initialized (stable source
 * identity). Called lazily on the first mint so app startup doesn't require an
 * explicit init call. Safe to call repeatedly — re-seeds the same source.
 */
let _minterReady = false
export function EnsureCaseNumberMinter(): number {
  if (_minterReady) return SsIdGetSource()
  const src = InitCaseNumberMinter()
  _minterReady = true
  return src
}

/** CaseNumberSource — the 28-bit issuing-server identity embedded in the id. */
export function CaseNumberSource(id: SsId): number {
  return SsIdSource(id)
}

/** CaseNumberIsHot — true if the id is a Hot UUID (MSb = 1). */
export function CaseNumberIsHot(id: SsId): boolean {
  return SsIdMsb(id) === 1
}

/**
 * CaseNumberWindowSeconds — seconds elapsed within the current 4.25-year Hot
 * window (the id's timestamp field). Add SsIdWindowStart() for absolute seconds.
 */
export function CaseNumberWindowSeconds(id: SsId): number {
  return SsIdUnpack(id)[0]
}

/** CaseNumberUnixSeconds — absolute Unix seconds for the id (current window). */
export function CaseNumberUnixSeconds(id: SsId): number {
  return CaseNumberWindowSeconds(id) + SsIdWindowStart()
}

/** CaseNumberToHex — 64-bit value as 16 lowercase hex chars (stable, sortable). */
export function CaseNumberToHex(id: SsId): string {
  return id.toString(16).padStart(16, "0")
}

/**
 * CaseNumberToSigned — the 64-bit value as a SIGNED bigint, ready for Postgres
 * `bigint`. A SubsecondId Hot UUID has MSb (bit 63) = 1, so the raw value
 * exceeds 2^63-1 and does NOT fit a signed bigint. We store the signed 64-bit
 * interpretation (BigInt.asIntN) — lossless and reversible, keeps the column a
 * real 64-bit signed int (fastest Postgres b-tree lookup). The sign bit is the
 * Hot flag; it does not affect provenance. Use CaseNumberFromHex or asUintN to
 * recover the unsigned/canonical form.
 */
export function CaseNumberToSigned(id: SsId): bigint {
  return BigInt.asIntN(64, id)
}

/** CaseNumberToUnsigned — recover the unsigned 64-bit value from a signed bigint. */
export function CaseNumberToUnsigned(stored: bigint): bigint {
  return BigInt.asUintN(64, stored)
}

/** SignedToHex — the 16-hex canonical form from a stored signed bigint. */
export function SignedToHex(stored: bigint): string {
  return CaseNumberToHex(BigInt.asUintN(64, stored))
}

/** CaseNumberFromHex — parse 16 hex chars into a 64-bit case number. */
export function CaseNumberFromHex(hex: string): SsId {
  const clean = hex.toLowerCase().replace(/[^0-9a-f]/g, "")
  if (clean.length !== 16) throw new Error(`case number hex must be 16 chars`)
  return BigInt("0x" + clean)
}

/**
 * CaseNumberToDisplay — human-readable case number:
 * FLG-<base36 seconds>-<2hex ticker>-<6base36 source>. Example: FLG-4B7K2-0A-1H8C3E
 */
export function CaseNumberToDisplay(id: SsId): string {
  const [seconds, ticker] = SsIdUnpack(id)
  const source = SsIdSource(id)
  const secondsB36 = seconds.toString(36).toUpperCase()
  const tickerHex = ticker.toString(16).toUpperCase().padStart(2, "0")
  const srcB36 = source.toString(36).toUpperCase().padStart(6, "0")
  return `FLG-${secondsB36}-${tickerHex}-${srcB36}`
}

/** CaseNumberWindowId — the id's window count (rolls each 4.25-year window). */
export function CaseNumberWindowId(id: SsId, now?: number): number {
  return SsIdWindowCount(now)
}
