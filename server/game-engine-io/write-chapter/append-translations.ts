import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";
import readOrCreateJSON from "@/game-engine-io/read-or-create-json.ts";

export interface Translation {
    nid: string;
    text: string;
}

export async function appendTranslations({
    projectNameEndingInDotLtProj,
    newTranslations,
}: {
    projectNameEndingInDotLtProj: string;
    newTranslations: Translation[];
}): Promise<void> {
    const filePath = getPathWithinLtMaker(
        `${projectNameEndingInDotLtProj}/game_data/translations.json`
    );

    // Add the special _attribution entry if it doesn't exist in newTranslations
    if (!newTranslations.some(t => t.nid === "_attribution")) {
        newTranslations.push({
            nid: "_attribution",
            text: ""
        });
    }

    const [translations, wasFallback] = await readOrCreateJSON<Translation[]>(
        filePath,
        newTranslations,
        projectNameEndingInDotLtProj
    );

    if (wasFallback) {
        return;
    }

    // Check for duplicate nids and update them instead of adding duplicates
    for (const newTranslation of newTranslations) {
        const existingIndex = translations.findIndex(t => t.nid === newTranslation.nid);
        if (existingIndex >= 0) {
            translations[existingIndex] = newTranslation;
        } else {
            translations.push(newTranslation);
        }
    }

    await Deno.writeTextFile(filePath, JSON.stringify(translations, null, 2));
}

if (import.meta.main) {
    appendTranslations({
        projectNameEndingInDotLtProj: "_the-grand-tourney.ltproj",
        newTranslations: [
            { nid: "_attribution", text: "" }
        ],
    }).then(() => {
        console.log("Appended translations successfully.");
    });
} 