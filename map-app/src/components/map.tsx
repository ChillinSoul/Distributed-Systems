"use client";
import { MapData } from "@/types/map";
import React from "react";

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
          // Calcul des coordonnées des extrémités de la route
          const x1 = (startIntersection.coordinates[0] - minX) * scale + margin;
          const y1 = (startIntersection.coordinates[1] - minY) * scale + margin;
          const x2 = (endIntersection.coordinates[0] - minX) * scale + margin;
          const y2 = (endIntersection.coordinates[1] - minY) * scale + margin;

          // Calcul des coordonnées du milieu de la route
          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2;

          return (
            <g key={road.id}>
              {/* Ligne de la route */}
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="blue"
                strokeWidth="2"
              />
              {/* Cône orange pour les routes en construction */}
              {road.underConstruction && (
                <g>
                  {/* Triangle du cône */}
                  <polygon
                    points={`${midX},${midY - 10} ${midX - 5},${midY + 10} ${
                      midX + 5
                    },${midY + 10}`}
                    fill="orange"
                    stroke="black"
                    strokeWidth="0.5"
                  />
                  {/* Rectangle à la base du cône */}
                  <rect
                    x={midX - 6}
                    y={midY + 10}
                    width={12}
                    height={4}
                    fill="orange"
                    stroke="black"
                    strokeWidth="0.5"
                  />
                </g>
              )}
            </g>
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
