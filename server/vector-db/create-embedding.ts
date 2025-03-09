import OpenAI from "openai";

export interface CreateEmbeddingOptions {
  text: string;
  model?: OpenAI.Embeddings.EmbeddingModel;
}

export default async function createEmbedding({
  text,
  model = "text-embedding-3-small",
}: CreateEmbeddingOptions): Promise<number[]> {
  const openai = new OpenAI();
  const response = await openai.embeddings.create({
    model,
    input: text,
    encoding_format: "float",
  });

  return response.data[0].embedding as number[];
}

if (import.meta.main) {
  const text = "Hello world. This is a sample text to embed.";
  const embedding = await createEmbedding({ text });
  console.log("Embedding:", embedding);
}