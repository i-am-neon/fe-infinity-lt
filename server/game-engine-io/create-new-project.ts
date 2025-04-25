import { getLtMakerPath } from "@/file-io/get-path-within-lt-maker.ts";
import { copy, ensureDir } from "https://deno.land/std/fs/mod.ts";
import { join, normalize } from "https://deno.land/std/path/mod.ts";

/**
 * Creates a new LT project by copying the default project template 
 * and customizing it with the provided name and ID
 */
export default async function createNewProject(
    projectNid: string,
    projectTitle: string,
    ltMakerPath: string,
    newProjectRelativePath: string
): Promise<string> {
    console.log(`Creating new project with:
    NID: ${projectNid}
    Title: ${projectTitle}
    Base Path: ${ltMakerPath}
    Relative Path: ${newProjectRelativePath}
  `);

    // Normalize paths for cross-platform compatibility
    ltMakerPath = normalize(ltMakerPath.replace(/"/g, ''));
    newProjectRelativePath = normalize(newProjectRelativePath.replace(/"/g, ''));

    const srcPath = join(ltMakerPath, 'default.ltproj');
    const destPath = join(ltMakerPath, newProjectRelativePath);

    try {
        // Create the destination directory structure
        await ensureDir(destPath);

        // Copy the default project to the new location
        await copy(srcPath, destPath, { overwrite: true });

        // Update the metadata.json file with new project info
        await updateMetadata(destPath, projectNid, projectTitle);

        // Update game_nid and title in constants.json
        await updateConstants(destPath, projectNid, projectTitle);

        console.log(`Project initialized at ${destPath}`);
        return destPath;
    } catch (error: unknown) {
        console.error(`Error initializing project: ${error}`);
        if (error instanceof Error) {
            throw new Error(`Project initialization failed: ${error.message}`);
        } else {
            throw new Error(`Project initialization failed: ${String(error)}`);
        }
    }
}

/**
 * Updates the metadata.json file with new project information
 */
async function updateMetadata(projectPath: string, projectNid: string, projectTitle: string): Promise<void> {
    const metadataPath = join(projectPath, 'metadata.json');

    try {
        // Read the current metadata
        const metadataContent = await Deno.readTextFile(metadataPath);
        const metadata = JSON.parse(metadataContent);

        // Update metadata
        metadata.date = new Date().toISOString();
        metadata.project = projectTitle;

        // Write the updated metadata
        await Deno.writeTextFile(metadataPath, JSON.stringify(metadata, null, 4));
    } catch (error: unknown) {
        console.error(`Error updating metadata: ${error}`);
        if (error instanceof Error) {
            throw new Error(`Failed to update metadata: ${error.message}`);
        } else {
            throw new Error(`Failed to update metadata: ${String(error)}`);
        }
    }
}

/**
 * Updates constants.json to set game_nid and title
 */
async function updateConstants(projectPath: string, projectNid: string, projectTitle: string): Promise<void> {
    const constantsPath = join(projectPath, 'game_data', 'constants.json');

    try {
        // Read the current constants
        const constantsContent = await Deno.readTextFile(constantsPath);
        const constants = JSON.parse(constantsContent);

        // Find and update game_nid and title constants
        for (const constant of constants) {
            if (constant.nid === 'game_nid') {
                constant.value = projectNid;
            } else if (constant.nid === 'title') {
                constant.value = projectTitle;
            }
        }

        // Write the updated constants
        await Deno.writeTextFile(constantsPath, JSON.stringify(constants, null, 4));
    } catch (error: unknown) {
        console.error(`Error updating constants: ${error}`);
        if (error instanceof Error) {
            throw new Error(`Failed to update constants: ${error.message}`);
        } else {
            throw new Error(`Failed to update constants: ${String(error)}`);
        }
    }
}

// For testing directly with Deno
if (import.meta.main) {
    const ltMakerPath = getLtMakerPath();
    await createNewProject("test_game", "Test Game", ltMakerPath, "_test_game.ltproj");
} 