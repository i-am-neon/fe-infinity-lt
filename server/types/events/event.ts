import { TriggerEnum } from "@/types/events/trigger-enum.ts";

export interface Event {
  name: string;
  trigger: TriggerEnum;
  level_nid: string | null;
  condition: string;
  commands: [];
  only_once: boolean;
  priority: number;
  _source: string[];
}

