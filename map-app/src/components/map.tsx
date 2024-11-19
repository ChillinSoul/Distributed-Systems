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

const SvgMap: React.FC<{ mapData: MapData }> = ({ mapData }) => {
  const width = 800; // Augmenter la largeur
  const height = 600; // Augmenter la hauteur

  // Calculer les limites pour centrer la carte
  const margin = 20;
  const allX = mapData.intersections.map((i) => i.coordinates[0]);
  const allY = mapData.intersections.map((i) => i.coordinates[1]);
  const minX = Math.min(...allX);
  const minY = Math.min(...allY);
  const maxX = Math.max(...allX);
  const maxY = Math.max(...allY);

  const scaleX = (width - 2 * margin) / (maxX - minX);
  const scaleY = (height - 2 * margin) / (maxY - minY);
  const scale = Math.min(scaleX, scaleY);

  return (
    <svg width={width} height={height} style={{ border: "1px solid black" }}>
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
              x1={(startIntersection.coordinates[0] - minX) * scale + margin}
              y1={(startIntersection.coordinates[1] - minY) * scale + margin}
              x2={(endIntersection.coordinates[0] - minX) * scale + margin}
              y2={(endIntersection.coordinates[1] - minY) * scale + margin}
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
            cx={(intersection.coordinates[0] - minX) * scale + margin}
            cy={(intersection.coordinates[1] - minY) * scale + margin}
            r="5"
            fill="red"
          />
          <text
            x={(intersection.coordinates[0] - minX) * scale + margin + 10}
            y={(intersection.coordinates[1] - minY) * scale + margin}
            fontSize="12"
            fill="black"
          >
            {intersection.id}
          </text>
        </g>
      ))}
    </svg>
  );
};

export default SvgMap;
