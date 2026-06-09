export interface RouteStep {
  instruction: string;
  distance: number;
  time: number;
  sign: number;
  streetName: string;
}

export interface RouteData {
  polyline: [number, number][];
  distance: number;
  time: number;
  steps: RouteStep[];
}
