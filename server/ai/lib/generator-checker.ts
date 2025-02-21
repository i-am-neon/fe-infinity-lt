import generateStructuredData from "@/lib/generate-structured-data.ts";
import { ZodSchema } from "zod";
import { OpenAIChatModelId } from "@ai-sdk/openai/internal";

export interface CheckerOutputFix<T> {
  fixText: string;
  fixObject: Partial<T>;
}

export interface GeneratorCheckerAllInOneParams<T> {
  generatorSystemMessage: string;
  generatorPrompt: string;
  generatorSchema: ZodSchema<T>;

  checkerSystemMessage: string;
  checkerPrompt: (candidate: T) => string;
  checkerSchema: ZodSchema<CheckerOutputFix<T>>;

  generatorModel?: OpenAIChatModelId;
  temperatureGenerator?: number;

  checkerModel?: OpenAIChatModelId;
  temperatureChecker?: number;

  maxAttempts?: number;
}

export async function genAndCheck<T>(
  params: GeneratorCheckerAllInOneParams<T>
): Promise<T> {
  const {
    generatorSystemMessage,
    generatorPrompt,
    generatorSchema,
    checkerSystemMessage,
    checkerPrompt,
    checkerSchema,
    generatorModel = "gpt-4o",
    temperatureGenerator = 1,
    checkerModel = "gpt-4o-mini",
    temperatureChecker = 0,
    maxAttempts = 3,
  } = params;

  let partialFix: Partial<T> | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    // 1) Generate candidate
    let finalGeneratorPrompt = generatorPrompt;
    if (partialFix && Object.keys(partialFix).length > 0) {
      finalGeneratorPrompt += `\n\nPotential fix for previous attempt:\n${JSON.stringify(
        partialFix,
        null,
        2
      )}`;
    }
    const candidate = await generateStructuredData<T>({
      fnName: "generatorCheckerAllInOne: generator",
      systemMessage: generatorSystemMessage,
      prompt: finalGeneratorPrompt,
      schema: generatorSchema,
      temperature: temperatureGenerator,
      model: generatorModel,
    });

    // 2) Check candidate
    const finalCheckerPrompt = checkerPrompt(candidate);
    const fixCheck = await generateStructuredData<CheckerOutputFix<T>>({
      fnName: "generatorCheckerAllInOne: checker",
      systemMessage: checkerSystemMessage,
      prompt: finalCheckerPrompt,
      schema: checkerSchema,
      temperature: temperatureChecker,
      model: checkerModel,
    });

    if (fixCheck.fixText === "None") {
      return candidate;
    }

    if (attempt === maxAttempts) {
      throw new Error(
        `Failed after ${maxAttempts} attempts. Last fixText: ${fixCheck.fixText}`
      );
    }
    partialFix = fixCheck.fixObject || {};
  }

  throw new Error("Unreachable code in generatorCheckerAllInOne");
}

