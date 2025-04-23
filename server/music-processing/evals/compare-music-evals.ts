import { testPrologueChapter } from "@/ai/test-data/prologueTestData.ts";
import allSongsInContext from "./all-songs-in-context.ts";
import chooseSongWithSimilarity from "./choose-song-with-similarity.ts";
import justSimilaritySearch from "@/music-processing/evals/just-similarity-search.ts";

async function runComparisons() {
    const scenarios: string[] = [
        // // Scenario 1: Festival ambush in Jester's Fields
        // `Rumors spread swiftly that supporters of the executed commander are plotting revenge. As the group moves through the lively Jester's Fields—now shadowed with suspicion—they are ambushed by masked agitators from the Order of the Glorious Blade, seeking to avenge their fallen and discredit the heroes. In the chaos, Marin attempts to mediate, using her sharp wit to stall the attackers, while Evelyn and Silas protect festival-goers. Cassandra, disturbed by the consequences of their decision, fights with renewed determination, while Alden works to disarm magical traps set by the vengeful agitators. Midway through the battle, the party discovers a Vulnerary dropped by a fleeing combatant.`,
        // // Scenario 2: Siege of Castle Roen
        // `Within the battered halls of Castle Roen, Serin Ashvale steels herself as the cursed fog creeps through the shattered gates. Eldric Fenmere, his trembling hands betraying both age and regret, tends to the wounded with supplies scavenged from the remains of the royal infirmary. Maev of Mirebrook, silent and sharp-eyed, paces the barricades, her distrustful gaze ever wary of both undead and desperate survivors. Brayden Thorne, his shoulders squared with grim determination, sharpens his battered axe and voices defiance against the encroaching night. As the dead begin to claw at the ancient stones, the four gather in the war room, debating a perilous escape through the haunted Marketward—a treacherous district rumored to offer a route toward the legendary Shrine of Respite. Their hopes are flickers in the darkness, their alliances uneasy, but with the fog thickening each moment, there is no choice but to flee or perish.`,
        // // Scenario 3: Cataclysm at the Fallen Cathedral
        // `Amid the ruins of the once-glorious cathedral, the heroes unearth ancient scriptures that beckon them toward a forbidden ritual as thunder rumbles overhead and embers swirl in the desolate courtyard.`,
        `Chapter title: "${testPrologueChapter.title}"
        Scenario: Chapter Intro scene: ${testPrologueChapter.idea.intro}`
    ];

    // Accumulators for durations
    let sumLLM = 0;
    let sumSim = 0;
    let sumChoose = 0;
    let md = `# Music Evals Comparison\n\n`;

    for (const scenario of scenarios) {
        md += `## Scenario\n${scenario}\n\n`;

        // allSongsInContext (LLM only)
        const startLLM = performance.now();
        const resultLLM = await allSongsInContext(scenario);
        const endLLM = performance.now();
        const timeLLM = ((endLLM - startLLM) / 1000).toFixed(3);
        sumLLM += parseFloat(timeLLM);
        md += `### allSongsInContext (LLM-only)\n- Result: \`${resultLLM}\`\n- Time: ${timeLLM}s\n\n`;

        // chooseSongWithSimilarity (similarity + LLM)
        const startSim = performance.now();
        const resultSim = await chooseSongWithSimilarity(scenario);
        const endSim = performance.now();
        const timeSim = ((endSim - startSim) / 1000).toFixed(3);
        sumSim += parseFloat(timeSim);
        md += `### chooseSongWithSimilarity (sim+LLM)\n- Result: \`${resultSim}\`\n- Time: ${timeSim}s\n\n`;

        // justSimilaritySearch (existing AI-only)
        const startCM = performance.now();
        const resultCM = await justSimilaritySearch(scenario);
        const endCM = performance.now();
        const timeCM = ((endCM - startCM) / 1000).toFixed(3);
        sumChoose += parseFloat(timeCM);
        md += `### justSimilaritySearch (existing)\n- Result: \`${resultCM}\`\n- Time: ${timeCM}s\n\n`;
    }

    // Summary of average times
    md += `## Summary\n`;
    md += `- Average allSongsInContext: ${(sumLLM / scenarios.length).toFixed(3)}s\n`;
    md += `- Average chooseSongWithSimilarity: ${(sumSim / scenarios.length).toFixed(3)}s\n`;
    md += `- Average justSimilaritySearch: ${(sumChoose / scenarios.length).toFixed(3)}s\n\n`;
    md += `Generated on: ${new Date().toISOString()}\n`;

    // Write to Markdown file in the same directory
    const outputPath = new URL("./comparison-results.md", import.meta.url);
    await Deno.writeTextFile(outputPath, md);
    console.log(`Comparison results written to ${outputPath.pathname}`);
}

if (import.meta.main) {
    runComparisons().catch(console.error);
} 