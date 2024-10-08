"use client";
import React from "react";

interface Intersection {
  id: number;
  name: string;
  coordinates: [number, number];
}

interface Road {
  id: number;
  start: number;
  end: number;
  length: number;
}

interface MapData {
  intersections: Intersection[];
  roads: Road[];
}

// Updated larger map data
const mapData: MapData = {
  intersections: [
    { id: 1, name: "A", coordinates: [50, 300] },
    { id: 2, name: "B", coordinates: [150, 300] },
    { id: 3, name: "C", coordinates: [250, 300] },
    { id: 4, name: "D", coordinates: [350, 300] },
    { id: 5, name: "E", coordinates: [50, 200] },
    { id: 6, name: "F", coordinates: [150, 200] },
    { id: 7, name: "G", coordinates: [250, 200] },
    { id: 8, name: "H", coordinates: [350, 200] },
    { id: 9, name: "I", coordinates: [50, 100] },
    { id: 10, name: "J", coordinates: [150, 100] },
    { id: 11, name: "K", coordinates: [250, 100] },
    { id: 12, name: "L", coordinates: [350, 100] },
    { id: 13, name: "M", coordinates: [50, 400] },
    { id: 14, name: "N", coordinates: [150, 400] },
    { id: 15, name: "O", coordinates: [250, 400] },
    { id: 16, name: "P", coordinates: [350, 400] },
    { id: 17, name: "Q", coordinates: [100, 350] },
    { id: 18, name: "R", coordinates: [200, 350] },
    { id: 19, name: "S", coordinates: [300, 350] },
    { id: 20, name: "T", coordinates: [200, 250] },
  ],
  roads: [
    { id: 1, start: 1, end: 2, length: 100 },
    { id: 2, start: 2, end: 3, length: 100 },
    { id: 3, start: 3, end: 4, length: 100 },
    { id: 4, start: 5, end: 6, length: 100 },
    { id: 5, start: 6, end: 7, length: 100 },
    { id: 6, start: 7, end: 8, length: 100 },
    { id: 7, start: 9, end: 10, length: 100 },
    { id: 8, start: 10, end: 11, length: 100 },
    { id: 9, start: 11, end: 12, length: 100 },
    { id: 10, start: 13, end: 14, length: 100 },
    { id: 11, start: 14, end: 15, length: 100 },
    { id: 12, start: 15, end: 16, length: 100 },
    { id: 13, start: 17, end: 1, length: 200 },
    { id: 14, start: 2, end: 18, length: 100 },
    { id: 15, start: 18, end: 3, length: 100 },
    { id: 16, start: 4, end: 19, length: 100 },
    { id: 17, start: 19, end: 20, length: 100 },
    { id: 18, start: 20, end: 6, length: 100 },
    { id: 19, start: 5, end: 17, length: 100 },
    { id: 20, start: 9, end: 12, length: 100 },
    { id: 21, start: 1, end: 13, length: 100 },
    { id: 22, start: 3, end: 15, length: 100 },
    { id: 23, start: 4, end: 16, length: 100 },
    { id: 24, start: 2, end: 18, length: 100 },
    { id: 25, start: 10, end: 12, length: 100 },
    { id: 26, start: 6, end: 9, length: 100 },
  ],
};

const SvgMap: React.FC = () => {
  return (
    <svg width="400" height="500" style={{ border: "1px solid black" }}>
      {/* Draw roads */}
      {mapData.roads.map((road) => {
        const startIntersection = mapData.intersections.find(
          (i) => i.id === road.start
        );
        const endIntersection = mapData.intersections.find(
          (i) => i.id === road.end
        );
        if (startIntersection && endIntersection) {
          return (
            <line
              key={road.id}
              x1={startIntersection.coordinates[0]}
              y1={startIntersection.coordinates[1]}
              x2={endIntersection.coordinates[0]}
              y2={endIntersection.coordinates[1]}
              stroke="blue"
              strokeWidth="2"
            />
          );
        }
        return null;
      })}

      {/* Draw intersections */}
      {mapData.intersections.map((intersection) => (
        <g key={intersection.id}>
          <circle
            cx={intersection.coordinates[0]}
            cy={intersection.coordinates[1]}
            r="5"
            fill="red"
          />
          <text
            x={intersection.coordinates[0] + 10} // Position text to the right of the circle
            y={intersection.coordinates[1]}
            fontSize="12"
            fill="black"
          >
            {intersection.name}
          </text>
        </g>
      ))}
    </svg>
  );
};

export default SvgMap;
