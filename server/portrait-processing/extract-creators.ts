import { allPortraitOptions } from "./all-portrait-options.ts";

// Function to extract creator names from originalName
function extractCreatorNames(portraitOptions: typeof allPortraitOptions): string[] {
    const creatorSet = new Set<string>();

    // Regular expression to match text inside curly braces
    const creatorRegex = /{([^}]+)}/;

    // Process each portrait option
    portraitOptions.forEach(portrait => {
        if (portrait.originalName) {
            const match = portrait.originalName.match(creatorRegex);
            if (match && match[1]) {
                // Add the creator name to the set (trims any whitespace)
                creatorSet.add(match[1].trim());
            }
        }
    });

    // Convert set to sorted array
    return Array.from(creatorSet).sort();
}

// Extract creator names and print as an array
const creators = extractCreatorNames(allPortraitOptions);
console.log("const creators = [");
creators.forEach(creator => {
    console.log(`  "${creator}",`);
});
console.log("];");

// Log count of unique creators
console.log(`\n// Found ${creators.length} unique creators`); 