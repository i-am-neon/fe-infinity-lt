import { getCurrentLogger } from "@/lib/current-logger.ts";
import { openai } from "@ai-sdk/openai";
import { google } from '@ai-sdk/google';
import { generateObject, NoObjectGeneratedError } from "ai";
import "jsr:@std/dotenv/load";
import { z, ZodSchema } from "zod";
import { getAIApiKey } from "@/lib/api-key-manager.ts";

export type ModelType = "nano" | "fast" | "strong";
const LLM_PROVIDER = "openai";

export class FreeTierExceededError extends Error {
  public status?: number;
  public providerCode?: string;
  constructor(message: string, opts?: { status?: number; providerCode?: string }) {
    super(message);
    this.name = "FreeTierExceededError";
    this.status = opts?.status;
    this.providerCode = opts?.providerCode;
  }
}

// --- NEW: narrow all the ways the AI SDK / Google provider may surface quota errors ---
function isQuotaError(err: any): boolean {
  const status =
    err?.status ?? err?.statusCode ?? err?.response?.status ?? err?.cause?.status;
  const providerCode =
    err?.errorCode ??
    err?.code ??
    err?.response?.body?.error?.status ??
    err?.cause?.error?.status ??
    err?.cause?.statusText;
  const msg = (err?.message ?? "").toString();

  // 429 OR explicit RESOURCE_EXHAUSTED OR a “quota exceeded” style message
  if (status === 429) return true;
  if (typeof providerCode === "string" && /RESOURCE_EXHAUSTED/i.test(providerCode)) return true;
  if (/quota|exceed|exhausted|check\s*quota|out of free tier/i.test(msg)) return true;
  if (typeof err?.response?.body?.error?.message === "string" &&
    /quota|exceed|exhausted|check\s*quota/i.test(err.response.body.error.message)) return true;

  return false;
}

function extractNoObjectContext(err: any) {
  const finishReason = err?.finishReason ?? err?.response?.body?.candidates?.[0]?.finishReason;
  const usage = err?.usage ?? err?.response?.body?.usageMetadata;
  const modelVersion = err?.response?.body?.modelVersion;
  const responseId = err?.response?.body?.responseId;
  return { finishReason, usage, modelVersion, responseId };
}

export default async function generateStructuredData<T>({
  fnName,
  schema,
  systemMessage,
  prompt,
  temperature,
  model = "fast",
  logResults = true,
}: {
  fnName: string;
  schema: ZodSchema<T>;
  systemMessage: string;
  prompt?: string;
  temperature?: number;
  model?: ModelType;
  logResults?: boolean;
}): Promise<T> {
  const logger = getCurrentLogger();
  let lastError: unknown;
  const startTime = performance.now();

  // Get API key from our key manager
  const aiKey = getAIApiKey();

  if (!aiKey) {
    const error = "No OpenAI API key found. Please provide an API key in the settings.";
    logger.error(error);
    throw new Error(error);
  }

  // Temporarily set Google key for the AI SDK
  let originalAIKey: string | undefined;
  originalAIKey = Deno.env.get("GOOGLE_GENERATIVE_AI_API_KEY");
  Deno.env.set("GOOGLE_GENERATIVE_AI_API_KEY", aiKey);

  try {
    const _model = model === "nano"
      ? google("gemini-2.5-flash-lite")
      : model === "fast"
        ? google("gemini-2.5-flash")
        : google("gemini-2.5-pro");

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const attemptStartTime = performance.now();
        const { object: result } = await generateObject({
          model: _model,
          schema,
          system: systemMessage,
          prompt: prompt || "no prompt provided",
          temperature,
          providerOptions: {
            google: {
              thinkingConfig: {
                thinkingBudget: model === 'strong' ? -1 : undefined, // dynamically choose thinking based on task
                // thinkingBudget: model === 'strong' ? 32768 : undefined, // Max out thinking budget
              },
            },
          },
        });
        const attemptDuration = performance.now() - attemptStartTime;

        logResults && logger.debug(
          `[generateStructuredData: ${fnName}] Attempt ${attempt} succeeded`,
          { model: _model.modelId, result, duration_ms: Math.round(attemptDuration) }
        );

        const totalDuration = performance.now() - startTime;
        logResults && logger.info(
          `[generateStructuredData: ${fnName}] Total execution completed successfully`,
          { model: _model.modelId, attempts: attempt, duration_ms: Math.round(totalDuration) }
        );

        return result;
      } catch (error: any) {
        const attemptDuration = performance.now() - startTime;

        // --- NEW: detect free-tier/quota exhaustion and backoff/retry ---
        if (isQuotaError(error)) {
          const status =
            error?.status ?? error?.statusCode ?? error?.response?.status ?? 429;
          const providerCode =
            error?.errorCode ??
            error?.code ??
            error?.response?.body?.error?.status ??
            "RESOURCE_EXHAUSTED";

          const message =
            `Gemini free tier / quota exceeded (HTTP ${status}, ${providerCode}). ` +
            `Enable billing or wait for quota reset.`;

          logResults && logger.error(
            `[generateStructuredData: ${fnName}] Quota exhausted`,
            {
              model: _model.modelId,
              status,
              providerCode,
              // surface any server message if present
              serverMessage:
                error?.response?.body?.error?.message ?? error?.message,
              attempt,
              duration_ms: Math.round(attemptDuration),
            }
          );

          // wait 60s then retry, up to 3 attempts total
          if (attempt < 3) {
            const waitMs = 60_000;
            logResults && logger.warn(
              `[generateStructuredData: ${fnName}] Waiting ${waitMs / 1000}s before retry #${attempt + 1} due to quota`,
              { model: _model.modelId, attempt, next_attempt: attempt + 1, wait_ms: waitMs }
            );
            await new Promise((resolve) => setTimeout(resolve, waitMs));
            continue;
          }

          // On final attempt, surface a clear error to caller
          throw new FreeTierExceededError(message, { status, providerCode });
        }

        // --- Enhanced logging for empty-generation case ---
        if (typeof NoObjectGeneratedError.isInstance === "function"
          && NoObjectGeneratedError.isInstance(error)) {
          const ctx = extractNoObjectContext(error);
          logResults && logger.warn(
            `[generateStructuredData: ${fnName}] Attempt ${attempt} failed with NoObjectGeneratedError`,
            {
              model: _model.modelId,
              errorMessage: error.message,
              rawText: error.text || "No text available",
              finishReason: ctx.finishReason ?? error.finishReason ?? "unknown",
              usage: ctx.usage ?? error.usage,
              responseId: ctx.responseId,
              modelVersion: ctx.modelVersion,
              // Small hint to future me in logs:
              hint: "Empty candidates from model. Possible causes: overly strict schema, safety filtering, or early STOP.",
              duration_ms: Math.round(attemptDuration),
            }
          );
        } else {
          logResults && logger.warn(
            `[generateStructuredData: ${fnName}] Attempt ${attempt} failed`,
            { model: _model.modelId, error, duration_ms: Math.round(attemptDuration) }
          );
        }

        lastError = error;

        // If not last attempt, continue and retry
        if (attempt < 3) continue;

        // Final failure: synthesize a clearer error
        const totalDuration = performance.now() - startTime;

        if (typeof NoObjectGeneratedError.isInstance === "function"
          && NoObjectGeneratedError.isInstance(lastError)) {
          const ctx = extractNoObjectContext(lastError);
          const message =
            `[generateStructuredData: ${fnName}] All 3 attempts failed with NoObjectGeneratedError: ` +
            JSON.stringify({
              message: lastError.message,
              finishReason: ctx.finishReason ?? lastError.finishReason,
              usage: ctx.usage ?? lastError.usage,
              responseId: ctx.responseId,
              modelVersion: ctx.modelVersion,
              rawText: (lastError.text || "No text available"),
            });

          logResults && logger.error(
            `[generateStructuredData: ${fnName}] All 3 attempts failed`,
            {
              model: _model.modelId,
              error: lastError,
              errorDetails: {
                message: lastError.message,
                rawText: lastError.text,
                finishReason: ctx.finishReason ?? lastError.finishReason,
                usage: ctx.usage ?? lastError.usage,
                response: lastError.response,
                responseId: ctx.responseId,
                modelVersion: ctx.modelVersion,
              },
              duration_ms: Math.round(totalDuration),
            }
          );

          throw new Error(message);
        } else {
          const message = `[generateStructuredData: ${fnName}] All 3 attempts failed: ${String(lastError)}`;
          logResults && logger.error(
            `[generateStructuredData: ${fnName}] All 3 attempts failed`,
            { model: _model.modelId, error: lastError, duration_ms: Math.round(totalDuration) }
          );
          throw new Error(message);
        }
      }
    }

    throw new Error("[generateStructuredData] This should never happen.");
  } finally {
    // Restore original env var
    if (originalAIKey !== undefined) {
      Deno.env.set("GOOGLE_GENERATIVE_AI_API_KEY", originalAIKey);
    }
  }
}

// example usage unchanged...
if (import.meta.main) {
  const schema = z.object({ name: z.string(), age: z.number() });
  generateStructuredData({
    fnName: "generatePerson",
    schema,
    systemMessage: "Generate a person object",
  }).then((res) => console.log(res));
}