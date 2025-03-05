import similaritySearch from "@/vector-db/similarity-search.ts";

export default async function chooseItem(itemIdea: string): Promise<string> {
  const results = await similaritySearch({
    searchQuery: itemIdea,
    topK: 1,
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
