export interface Intersection {
    id: number;
    name: string;
    coordinates: [number, number];
  }
  
  export interface Road {
    underConstruction: boolean;
    id: number;
    start: number;
    end: number;
    length: number;
  }
  
  export interface MapData {
    intersections: Intersection[];
    roads: Road[];
  }
  