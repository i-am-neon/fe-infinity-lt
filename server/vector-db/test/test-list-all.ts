import pool from "@/vector-db/connection.ts";
import { VectorType } from "@/vector-db/types/vector-type.ts";

export async function listAllVectors(
  vectorType: VectorType
): Promise<Array<{ id: string; metadata: Record<string, unknown> }>> {
  const client = await pool.connect();
  try {
    const tableName =
      vectorType === "maps" ? "maps_vectors" : "portraits_vectors";
    const queryText = `SELECT id, metadata FROM ${tableName}`;
    const result = await client.query(queryText);
    const rows = result.rows as Array<{
      id: string;
      metadata: Record<string, unknown>;
    }>;
    return rows;
  } finally {
    client.release();
  }
}

if (import.meta.main) {
  (async () => {
    const res = await listAllVectors("portraits");
    console.log("res:", res);
  })();
}

