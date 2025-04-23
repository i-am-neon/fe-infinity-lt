import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import type { SongListWithLinks, SongMetadata } from "@/music-processing/types/song-list-with-links.ts";

export default function concatAllMusicOptions(): string {
    const listsDir = getPathWithinServer("assets/music/lists-with-links");
    const allOptions: SongMetadata[] = [];
    for (const entry of Deno.readDirSync(listsDir)) {
        if (!entry.isFile || !entry.name.endsWith(".json")) continue;
        const filePath = `${listsDir}/${entry.name}`;
        const raw = Deno.readTextFileSync(filePath);
        const songs = JSON.parse(raw) as SongListWithLinks;
        for (const { youTubeLink, ...metadata } of songs) {
            allOptions.push(metadata);
        }
    }
    return JSON.stringify(allOptions);
}

if (import.meta.main) {
    const options = concatAllMusicOptions();
    console.log(options);
}
