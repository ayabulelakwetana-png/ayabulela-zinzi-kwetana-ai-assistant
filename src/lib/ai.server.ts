/**
 * AI service layer. Server-only.
 * Talks to the Lovable AI Gateway (OpenAI-compatible chat completions), so the
 * model can be swapped in one place without touching feature code.
 */

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
export const DEFAULT_MODEL = "google/gemini-3.7-flash";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export class AiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

function messageForStatus(status: number, fallback: string) {
  if (status === 429) return "StudyEazy AI is busy right now. Please wait a moment and try again.";
  if (status === 402)
    return "The StudyEazy AI workspace is out of AI credits. The app owner needs to top up before AI features work again.";
  if (status === 403)
    return "AI access is currently blocked for this workspace. Please contact the app owner.";
  if (status === 401) return "AI is not configured correctly. Please contact the app owner.";
  if (status === 400) return fallback || "That request could not be processed. Please adjust your input and try again.";
  return "StudyEazy AI could not complete that request. Please try again.";
}

export async function callAI(
  messages: ChatMessage[],
  options: { temperature?: number; model?: string; maxRetries?: number } = {},
): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new AiError("AI is not configured. Missing server AI key.", 401);

  const maxRetries = options.maxRetries ?? 2;
  let attempt = 0;

  for (;;) {
    let res: Response;
    try {
      res = await fetch(GATEWAY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Lovable-API-Key": apiKey,
          "X-Lovable-AIG-SDK": "fetch",
        },
        body: JSON.stringify({
          model: options.model ?? DEFAULT_MODEL,
          messages,
          temperature: options.temperature ?? 0.5,
        }),
      });
    } catch {
      if (attempt++ < maxRetries) {
        await new Promise((r) => setTimeout(r, 800 * attempt));
        continue;
      }
      throw new AiError("Network error while contacting StudyEazy AI. Check your connection.", 503);
    }

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      const retryable = res.status === 429 || res.status >= 500;
      if (retryable && attempt++ < maxRetries) {
        const retryAfter = Number(res.headers.get("Retry-After")) || attempt;
        await new Promise((r) => setTimeout(r, Math.min(retryAfter * 1000, 6000)));
        continue;
      }
      let detail = "";
      try {
        detail = (JSON.parse(text)?.error?.message ?? JSON.parse(text)?.message ?? "") as string;
      } catch {
        detail = "";
      }
      throw new AiError(messageForStatus(res.status, detail), res.status);
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content?.trim() ?? "";
    if (!content) throw new AiError("StudyEazy AI returned an empty response. Please try again.", 502);
    return content;
  }
}

/** Parses JSON out of a model response, tolerating code fences or stray prose. */
export function parseJsonResponse<T>(raw: string): T {
  const cleaned = raw
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1)) as T;
      } catch {
        /* fall through */
      }
    }
    throw new AiError("StudyEazy AI returned an unexpected format. Please try again.", 502);
  }
}
