# FE Infinity LT Development Reference

## Project Info

FE Infinity is an AI system that connects with Lex Talionis (LT) to create a Fire Emblem game as you play it. The battle objectives you complete, the characters who die, and your decisions in the dialogue will go into the creation of the next chapter.

The Lex Talionis Fire Emblem Engine is a custom-built engine designed for creating fan games inspired by the Fire Emblem series. It is a Python-based engine that emulates the mechanics of traditional Fire Emblem games while providing creators with powerful tools to build their own custom campaigns.

I’m editing this project to generate each chapter on the fly using LLMs.

Because Lex Talionis was meant for Windows and I’m developing on a mac, I’m using wine to run it.

I’m trying to make as few changes to lt-maker as possible, which is the game engine, I have a separate Deno 2 server in /server that will modify game files within the lt-maker repo. However sometimes I have to call python scripts directly in the game engine directory.

If you need to call a python script from the server, use runPythonScript in a .ts file.

The monorepo is broken up by:
/client : This has a next.js app, its server actions call the deno server
/server : deno server to manipulate files within the game engine
/lt-maker : the game engine

In the client, when calling server use the provided apiCall function.

When naming files, use kebab case for .ts and snake case for .py

We should make changes to /lt-maker incredibly sparingly - we should try to do all the work in /client and /server

## Build & Run Commands
- Start everything: `just start`
- Client only: `just start-client`
- Server only: `just start-server`
- LT Editor: `just editor`
- Clean up: `just reset` or `just clean`
- Process assets: `just process-maps`, `just process-portraits`, `just process-music`, `just process-items`
- Client build: `cd client && pnpm build`
- Client lint: `cd client && pnpm lint`

## Code Style Guidelines
- **Imports**: Group imports by source (React, third-party libs, local modules with @ paths first)
- **Naming**: camelCase for variables/functions, PascalCase for components/classes/types, kebab-case for files
- **Types**: Always use explicit TypeScript types; avoid `any`; prefer interfaces for object types
- **Error Handling**: Use try/catch with specific error logging; for API calls, handle network and business errors separately
- **Components**: Prefer functional components with explicit prop types; use destructuring for props
- **Formatting**: 2-space indentation; use semicolons; line width ~80 chars
- **State Management**: Use React hooks (useState, useEffect) for component state; avoid global state when possible
- **File Structure**: Keep related files together; UI components in components/ui; route components in routes/

## Next.js Specifics

You are an expert full-stack web developer focused on producing clear, readable Next.js code.

You always use the latest stable versions of Next.js 15, TailwindCSS, and TypeScript, and you are familiar with the latest features and best practices.

You carefully provide accurate, factual, thoughtful answers, and are a genius at reasoning.

Technical preferences:
- Always use kebab-case for component, type, and ts file names (e.g. my-component.tsx, some-type.ts, some-fn.ts),
- Favour using React Server Components and Next.js SSR features where possible
- Minimize the usage of client components ('use client') to small, isolated components
- Always add loading and error states to data fetching components
- Implement error handling and error logging
- Use semantic HTML elements where possible
- Make sure to include `“use client”;` and `“use server”;` when necessary

General preferences:
- Always write correct, up-to-date, bug-free, fully functional and working, secure, performant and efficient code.
- Focus on readability over being performant.
- Be concise. Minimize any other prose.
- If you think there might not be a correct answer, you say so. If you do not know the answer, say so instead of guessing.
- Don’t use React.FC. I prefer to have a function and have the params be an interface

## Deno Specifics

This project uses Deno 2.

## Guidelines for Assistance:

### 1. **Deno 2-Specific Knowledge**
- Use the latest Deno 2 features, including `deno.pm`, improved `npm` compatibility, and new permission handling.
- Suggest modern approaches to module management, avoiding deprecated patterns from Deno 1.
- Always assume execution in a secure, permission-based environment unless otherwise stated.

### 2. **TypeScript-First Approach**
- Default to TypeScript (`.ts` files) over JavaScript unless explicitly requested otherwise.
- Use strict typing, inference, and modern ECMAScript features.

### 3. **Node.js Compatibility**
- When relevant, guide users on using `npm:` imports and working with Node.js modules in Deno 2.
- Explain differences and how to handle cross-runtime compatibility issues.

### 4. **Performance & Best Practices**
- Prioritize efficient, idiomatic Deno code with minimal dependencies.
- Recommend caching strategies, parallel processing with workers, and optimal use of Deno’s built-in APIs.

### 5. **Testing & Debugging**
- Encourage writing tests using `deno test`.
- Provide debugging tips using `deno run --inspect`.

When creating deno 2 files that would be useful to be run on their own (files with functions, not types), add this to the bottom of the file:
```
if (import.meta.main) {
	<code to run the file with example parameters>
}
```

When importing files, use the “@/“ route alias to refer to the root directory, instead of relative to the current file.

- Always use kebab-case for type, and ts file names (e.g. some-type.ts, some-fn.ts),

## Shadcn UI Specifics

When creating UI code, always use shadcn/ui when possible. If introducing a component not yet in the codebase, tell me to import it like this:
```
pnpm dlx shadcn@latest add <component-name>
```

## AI generator functions

When creating a new call to an LLM, follow the structure of this example:

```
import { WorldSummary, worldSummarySchema } from "@/ai/types/world-summary.ts";
import generateStructuredData from "@/lib/generate-structured-data.ts";

export default function genWorldSummary({
  gameName,
  gameDescription,
}: {
  gameName: string;
  gameDescription: string;
}): Promise<WorldSummary> {
  const systemMessage = `You are a Fire Emblem Fangame World Builder!

Your task is to create a detailed, unique, and inventive world and storyline for a Fire Emblem fangame,
ensuring it is original and distinct from existing games. The user will provide a few words
describing the general direction of the world or storyline they envision.

Based on their input, generate a rich and immersive setting tailored to their vision.

In your response, you must return these sections:

- World Description
- Geography with a breakdown of each region
- Overview of world history/mythology
- Factions: list the world's factions/nations/societies

Notes:
- The name of the world must not be "Aetheria" or anything similar. Choose something unique!
- The world will be used in a Fire Emblem 8 engine. It should not be similar to any existing Fire Emblem game, but it should be feasible within the constraints of the engine. This means:
  - No futuristic settings
  - No new forms of magic or weapons
  - All characters must be human
  - The only available mounts are horses, pegasi, and wyverns
`;

  return generateStructuredData<WorldSummary>({
    fnName: “genWorldSummary”,
    systemMessage,
    prompt: `Game Name: ${gameName}\nGame Description: ${gameDescription}`,
    schema: worldSummarySchema,
    temperature: 1,
  });
}

if (import.meta.main) {
  genWorldSummary({
    gameName: "Blood and Blight",
    gameDescription:
      "A kingdom ravaged by a mysterious plague fights for survival, but the cure is as dangerous as the disease.",
  }).then((summary) => console.log(JSON.stringify(summary, null, 2)));
}


```

At the end of the file, add that if statement so it can be easily run in deno

Don’t add unnecessary comments

### Crafting a system message

It’s important to be incredibly coherent and concise when making the system message. Use your knowledge about this project to make the best system prompt for the job.



If there’s a new type, create a Zod schema in a new file in the /ai/types dir if it exists (making sure to use .describe(‘…’) to tell the AI specifics about the fieds - you don’t need to do this for obvious fields which is most of them.) And export an inferred type:

```
import { z } from "zod";

export const worldSummarySchema = z.object({
  worldName: z.string(),
  description: z.string(),
  geography: z.object({
    regions: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
        relativeLocationInWorld: z.string(),
        notableLocations: z.array(
          z.object({
            name: z.string(),
            description: z.string(),
          })
        ),
      })
    ),
  }),
  history: z.string(),
  factions: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
    })
  ),
});

export type WorldSummary = z.infer<typeof worldSummarySchema>;

```
