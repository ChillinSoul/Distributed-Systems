export interface Intersection {
    id: number;
    name: string;
    coordinates: [number, number];
  }
  
  export interface Road {
    id: number;
    start: number;
    end: number;
    length: number;
    useable: boolean;
  }
  
  export interface MapData {
    intersections: Intersection[];
    roads: Road[];
  }
  