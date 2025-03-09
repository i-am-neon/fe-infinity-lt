import similaritySearch from "@/vector-db/similarity-search.ts";
import { getVectorStore } from "@/vector-db/init.ts";
import { VectorType } from "@/vector-db/types/vector-type.ts";

export async function handleTestSimilaritySearch(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const vectorType = url.searchParams.get("type") as VectorType || "maps";
    const query = url.searchParams.get("query") || "forest with mountains";
    const limit = parseInt(url.searchParams.get("limit") || "5", 10);

    // Check if we have vectors of this type
    const vectorStore = await getVectorStore();
    const availableVectors = vectorStore.getVectors(vectorType);
    
    if (availableVectors.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `No vectors available for type: ${vectorType}`,
          availableTypes: Object.entries(vectorStore.vectors)
            .filter(([_, vectors]) => vectors.length > 0)
            .map(([type]) => type),
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Run similarity search
    const results = await similaritySearch({
      vectorType,
      query,
      limit,
    });

    return new Response(
      JSON.stringify({
        success: true,
        query,
        vectorType,
        results,
        totalVectors: availableVectors.length,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Error in similarity search test:", errorMsg);
    
    return new Response(
      JSON.stringify({ success: false, error: errorMsg }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

if (import.meta.main) {
  const mockRequest = new Request("https://example.com/test-similarity-search?type=maps&query=forest", {
    method: "GET",
  });
  
  handleTestSimilaritySearch(mockRequest).then(async (response) => {
    console.log("Similarity search test:", await response.json());
  });
}