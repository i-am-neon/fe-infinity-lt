import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";

export function deleteSuspendSave() {
  const files = Deno.readDirSync(getPathWithinLtMaker("saves"));
  for (const file of files) {
    if (file.name.includes("suspend")) {
      Deno.removeSync(getPathWithinLtMaker(`saves/${file.name}`));
    }
  }
}

if (import.meta.main) {
  deleteSuspendSave();
}
