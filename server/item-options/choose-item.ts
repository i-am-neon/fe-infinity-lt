import { GameItem } from "@/vector-db/save-vectors-for-items.ts";
import similaritySearch from "@/vector-db/similarity-search.ts";

export default async function chooseItem(itemIdea: string): Promise<string> {
  const results = await similaritySearch<GameItem>({
    query: itemIdea,
    limit: 1,
    vectorType: "items",
  });

  if (results.length === 0) {
    throw new Error(`No items found matching idea: "${itemIdea}"`);
  }

  return results[0].id;
}

if (import.meta.main) {
  chooseItem("Throwing Lance").then((nid) => console.log(nid));
}

