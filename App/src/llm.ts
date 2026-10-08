/**
 * Local LLM client — talks to the USER'S OWN model endpoint.
 *
 * FreeLawGen is not the middleman: the app never calls a hosted LLM. The user
 * points it at a local endpoint (Ollama, llama.cpp server, or LM Studio), all
 * of which speak the OpenAI-compatible chat-completions API. Everything runs
 * on the user's machine; the prompt + response never leave it.
 *
 * Supported base URLs:
 *   - Ollama:      http://localhost:11434/v1   (OpenAI-compatible mode)
 *   - llama.cpp:   http://localhost:8080/v1
 *   - LM Studio:   http://localhost:1234/v1
 *
 * `baseUrl` should be the root that exposes `/chat/completions` (i.e. the
 * `/v1` prefix for the above). The API key is optional for local servers.
 */

export interface TLlmSettings {
  /** Base URL exposing /chat/completions (e.g. http://192.168.x.x:11434/v1). */
  baseUrl: string
  /** API key. Optional for local servers; required for some gateways. */
  apiKey: string
  /** Model name / tag (e.g. "llama3.1", "qwen2.5:14b", "gpt-oss-20b"). */
  model: string
}

export const DEFAULT_LLM_SETTINGS: TLlmSettings = {
  baseUrl: "http://localhost:11434/v1",
  apiKey: "",
  model: "llama3.1",
}

export interface TChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export interface TChatResult {
  content: string
  /** Raw model-reported token usage, when the endpoint provides it. */
  usage?: { promptTokens?: number; completionTokens?: number; totalTokens?: number }
  model: string
}

/**
 * Call the local LLM's chat-completions endpoint. Resolves with the assistant
 * message. Throws a descriptive Error on network/HTTP/parse failure.
 */
export async function chatCompletion(
  settings: TLlmSettings,
  messages: TChatMessage[],
  opts: { temperature?: number; maxTokens?: number; signal?: AbortSignal } = {},
): Promise<TChatResult> {
  const base = settings.baseUrl.replace(/\/+$/, "")
  const url = `${base}/chat/completions`

  const headers: Record<string, string> = { "content-type": "application/json" }
  if (settings.apiKey) headers["authorization"] = `Bearer ${settings.apiKey}`

  const body = JSON.stringify({
    model: settings.model,
    messages,
    temperature: opts.temperature ?? 0.4,
    // Local servers may ignore max_tokens; harmless if unsupported.
    max_tokens: opts.maxTokens ?? 2048,
    stream: false,
  })

  let res: Response
  try {
    res = await fetch(url, { method: "POST", headers, body, signal: opts.signal })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    throw new Error(
      `Could not reach your local LLM at ${url}. Is it running? (${msg})`,
    )
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Local LLM returned HTTP ${res.status}: ${text.slice(0, 300)}`)
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[]
    usage?: TChatResult["usage"]
    model?: string
  }
  const content = data.choices?.[0]?.message?.content
  if (typeof content !== "string") {
    throw new Error("Local LLM response had no message content.")
  }
  return { content, usage: data.usage, model: data.model ?? settings.model }
}

/**
 * Build the system prompt for drafting a legal document. The model produces
 * Markdown only; the @freelawgen/court toolkit handles the deterministic
 * docket filename, word count, and case number around it.
 */
export function pleadingSystemPrompt(docType: string): string {
  return [
    "You are a helpful legal drafting assistant for a self-represented (pro se)",
    "litigant. You are NOT a lawyer and you do NOT give legal advice. You help the",
    "person organize their own facts into a clearly-structured legal document.",
    "",
    `The document type is: ${docType}.`,
    "",
    "Rules:",
    "- Output Markdown only. No preamble, no explanation, just the document.",
    "- Use a top-level heading (# ) with the document title.",
    "- Use numbered counts/sections where appropriate (## Count I — ...).",
    "- State the facts the user gave you plainly; do not invent facts, dates, names,",
    "  courts, statutes, or case law. If a fact is missing, use a clear placeholder",
    "  like [DATE], [NAME], [AMOUNT] so the user can fill it in.",
    "- End with a short prayer for relief / requested outcome.",
    "- Keep it factual, calm, and organized. This is a draft for the user to edit.",
    "",
    "Remind yourself: this is a template to help a real person tell their own story.",
  ].join("\n")
}

/**
 * Ask the local LLM to draft a pleading from the user's plain-language facts.
 */
export async function draftPleading(
  settings: TLlmSettings,
  docType: string,
  userFacts: string,
  signal?: AbortSignal,
): Promise<TChatResult> {
  const messages: TChatMessage[] = [
    { role: "system", content: pleadingSystemPrompt(docType) },
    {
      role: "user",
      content: [
        `Draft a "${docType}" using ONLY these facts (fill placeholders for anything missing):`,
        "",
        userFacts,
      ].join("\n"),
    },
  ]
  return chatCompletion(settings, messages, { signal, temperature: 0.4 })
}
