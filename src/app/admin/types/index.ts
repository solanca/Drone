export interface Drone {
  ID?: string;
  model_type: string;
  zone: number;
}

export interface Attribute {
  ID?: string;
  name: string;
  value: string[];
}

export interface Policy {
  ID?: string;
  zone: number;
  start_time: string;
  end_time: string;
}
