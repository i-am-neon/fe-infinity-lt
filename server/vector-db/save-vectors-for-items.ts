import generateAndStoreVector from "@/vector-db/generate-and-store-vector.ts";

export interface GameItem {
  nid: string;
  name: string;
  desc: string;
  components?: [string, unknown][];
  [key: string]: unknown;
}

export default async function saveVectorsForItems(
  items: GameItem[]
): Promise<void> {
  for (const item of items) {
    // Create the text for embedding
    const text = `${item.name}: ${item.desc}`;

    // Create metadata for the item
    const metadata: Record<string, unknown> = {
      nid: item.nid,
      name: item.name,
      description: item.desc,
    };

    // Extract weapon_type and weapon_rank if they exist
    if (item.components) {
      const weaponTypeComponent = item.components.find(
        (component) => component[0] === "weapon_type"
      );
      const weaponRankComponent = item.components.find(
        (component) => component[0] === "weapon_rank"
      );

      if (weaponTypeComponent && weaponTypeComponent[1]) {
        metadata.weapon_type = weaponTypeComponent[1];
      }

      if (weaponRankComponent && weaponRankComponent[1]) {
        metadata.weapon_rank = weaponRankComponent[1];
      }
    }

    // Generate and store the vector
    await generateAndStoreVector({
      id: item.nid,
      text,
      metadata,
      vectorType: "items",
    });
  }
}

if (import.meta.main) {
  const sampleItems: GameItem[] = [
    {
      nid: "iron_sword",
      name: "Iron Sword",
      desc: "A basic sword made of iron. Reliable but not exceptional.",
      components: [
        ["weapon_type", "Sword"],
        ["weapon_rank", "E"],
      ],
    },
    {
      nid: "silver_lance",
      name: "Silver Lance",
      desc: "A powerful lance made of silver. Deals high damage but has lower durability.",
      components: [
        ["weapon_type", "Lance"],
        ["weapon_rank", "A"],
      ],
    },
  ];

  saveVectorsForItems(sampleItems)
    .then(() => console.log("Saved vectors for items"))
    .catch(console.error);
}

