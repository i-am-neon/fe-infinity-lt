import { v4 as uuid } from "uuid";

export default function shortUuid(): string {
  return uuid().split("-")[0].slice(0, 3);
}

