export interface Event {
  name: string;
  trigger: string;
  level_nid: string;
  condition: string;
  commands: [];
  only_once: boolean;
  priority: number;
  _source: string[];
}

