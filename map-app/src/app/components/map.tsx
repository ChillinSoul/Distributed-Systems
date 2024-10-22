"use client";
import React, { useEffect, useState } from "react";

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

const SvgMap: React.FC = () => {
  const [mapData, setMapData] = useState<MapData | null>(null); // État pour stocker les données de la carte

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const response = await fetch("/api"); // URL de ton API
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: MapData = await response.json();
        setMapData(data); // Mettre à jour l'état avec les données récupérées
      } catch (error) {
        console.error("Failed to fetch map data:", error);
      }
    };

    fetchMapData();
  }, []);

  // Afficher un message de chargement ou une erreur si les données ne sont pas encore disponibles
  if (!mapData) {
    return <div>Loading...</div>;
  }

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
