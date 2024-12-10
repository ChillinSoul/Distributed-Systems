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
  useable: boolean;
  oneWay: boolean;
  direction: string | null;
}

interface MapData {
  intersections: Intersection[];
  roads: Road[];
}

const SvgMap: React.FC<{
  mapData: MapData;
  onRoadClick?: (road: Road) => void;
}> = ({ mapData, onRoadClick }) => {
  const width = 800;
  const height = 600;

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
          const x1 = (startIntersection.coordinates[0] - minX) * scale + margin;
          const y1 = (startIntersection.coordinates[1] - minY) * scale + margin;
          const x2 = (endIntersection.coordinates[0] - minX) * scale + margin;
          const y2 = (endIntersection.coordinates[1] - minY) * scale + margin;

          return (
            <g key={road.id}>
              {/* Draw the road */}
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#555555"
                strokeWidth="8"
                style={{ cursor: "pointer" }}
                onClick={() => onRoadClick?.(road)}
              />
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="white"
                strokeDasharray="5, 5"
                strokeWidth="2"
              />

              {/* Add construction symbol if road is not usable */}
              {!road.useable && (
                <text
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2}
                  fontSize="32"
                  fill="orange"
                  textAnchor="middle"
                >
                  🚧
                </text>
              )}

              {/* Add arrows for one-way roads */}
              {road.oneWay && road.direction && (
                <g>
                  {generateRepeatedArrows(
                    x1,
                    y1,
                    x2,
                    y2,
                    road.direction,
                    25
                  ).map((arrow, index) => (
                    <polygon key={index} points={arrow} fill="white" />
                  ))}
                </g>
              )}
            </g>
          );
        }
        return null;
      })}

      {/* Draw intersections */}
      {mapData.intersections.map((intersection) => {
        const cx = (intersection.coordinates[0] - minX) * scale + margin;
        const cy = (intersection.coordinates[1] - minY) * scale + margin;

        return (
          <g key={intersection.id}>
            {/* Intersection circle */}
            <circle
              cx={cx}
              cy={cy}
              r="12"
              fill="#d3d3d3"
              stroke="black"
              strokeWidth="2"
            />
            {/* Intersection ID */}
            <text
              x={cx}
              y={cy + 4} // Center vertically inside the circle
              fontSize="10"
              fill="black"
              fontWeight="bold"
              textAnchor="middle"
            >
              {intersection.id}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/**
 * Generate repeated arrows along the road to indicate one-way direction
 */
function generateRepeatedArrows(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  direction: string,
  spacing: number
): string[] {
  const arrowLength = 10;
  const arrowWidth = 5;

  // Calculate the direction vector
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);

  // Normalize the direction vector
  const unitX = dx / length;
  const unitY = dy / length;

  // Determine number of arrows
  const numArrows = Math.floor(length / spacing);

  // Generate arrows
  const arrows: string[] = [];
  for (let i = 1; i <= numArrows; i++) {
    const baseX = x1 + i * spacing * unitX;
    const baseY = y1 + i * spacing * unitY;

    const tipX = baseX + unitX * arrowLength;
    const tipY = baseY + unitY * arrowLength;

    const corner1X = baseX + unitY * arrowWidth;
    const corner1Y = baseY - unitX * arrowWidth;

    const corner2X = baseX - unitY * arrowWidth;
    const corner2Y = baseY + unitX * arrowWidth;

    arrows.push(
      `${tipX},${tipY} ${corner1X},${corner1Y} ${corner2X},${corner2Y}`
    );
  }

  return arrows;
}

export default SvgMap;
