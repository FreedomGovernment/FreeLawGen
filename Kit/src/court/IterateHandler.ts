// Copyright AStarship <https://astarship.net>.
/**
 * CourtIterateHandler — shared HTTP handler for the legal-aid iterate endpoints.
 *
 * BOTH endpoints use this ONE handler (Captain directive: "both of them must use
 * the same code"). "Complaint" vs "Petition" is just a string compare — the
 * iterate algorithm doesn't care which document type it is.
 *
 * THE RULES (cap, log name, cases folder) come from the country's TCourtRules,
 * injected by the calling Court. Default: FreedomCourtRules.
 */

import { CourtIterate, CourtIterateError, type TCourtIterateConfig } from "./Iterate"
import type { TCourtRules } from "./Rules"

/** The handler shape (explicit so the .d.ts doesn't reference undici-types). */
export interface ICourtIterateHandler {
  POST: (req: Request) => Promise<Response>
}

/**
 * CourtIterateHandler — the shared Next.js App Router handler.
 *
 * @param cfg  The Court config (root + rules). Injected by the calling Court.
 */
export function CourtIterateHandler(cfg: TCourtIterateConfig | undefined): ICourtIterateHandler {
  return {
    async POST(req: Request) {
      try {
        let body: unknown = null
        try {
          body = await req.json()
        } catch {
          body = null
        }
        const document =
          body && typeof body === "object" && "document" in body
            ? (body as { document?: unknown }).document
            : undefined
        if (typeof document !== "string" || document.length === 0) {
          return new Response(
            JSON.stringify({
              ok: false,
              error: "Missing required field: \"document\" (a string path to the current draft).",
            }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          )
        }
        let amended: string | undefined
        if (body && typeof body === "object" && "amended" in body) {
          const a = (body as { amended?: unknown }).amended
          if (typeof a === "string") amended = a
        }
        const record = CourtIterate({ document, amended }, cfg)
        return new Response(
          JSON.stringify({ ok: true, ...record }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        )
      } catch (err) {
        if (err instanceof CourtIterateError) {
          return new Response(
            JSON.stringify({ ok: false, code: err.code, error: err.message }),
            { status: 409, headers: { "Content-Type": "application/json" } },
          )
        }
        const msg = err instanceof Error ? err.message : String(err)
        return new Response(
          JSON.stringify({ ok: false, code: "iterate_failed", error: msg }),
          { status: 500, headers: { "Content-Type": "application/json" } },
        )
      }
    },
  }
}

/**
 * Build a court config with a specific ruleset (helper for a Court to declare
 * its own legal system on the Kit's handler).
 */
export function CourtHandlerWithRules(root: string, rules?: TCourtRules): TCourtIterateConfig {
  return { court_root: root, rules }
}
