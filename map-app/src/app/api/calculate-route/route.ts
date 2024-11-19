import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * Reads and parses the map data from the JSON file.
 * 
 * @returns {Object} The parsed map data containing intersections and roads.
 */
function getMapData() {
  // Define the path to the JSON file containing the map data.
  const filePath = path.join(process.cwd(), 'data', 'mapData.json');

  // Read the file synchronously and parse the content to JSON.
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(jsonData);
}

/**
 * Implements Dijkstra's algorithm to find the shortest path between two intersections.
 * 
 * @param {Object} mapData - The map data containing intersections and roads.
 * @param {number} startId - The ID of the starting intersection.
 * @param {number} endId - The ID of the destination intersection.
 * @returns {Object|null} An object containing the shortest path and its distance, or null if no path exists.
 */
function dijkstra(mapData: any, startId: number, endId: number) {
  const { intersections, roads } = mapData;

  // Initialize distances to all intersections as infinity, and previous nodes as null.
  const distances: { [key: number]: number } = {};
  const previous: { [key: number]: number | null } = {};
  const queue: number[] = [];

  intersections.forEach((intersection: any) => {
    distances[intersection.id] = Infinity;
    previous[intersection.id] = null;
    queue.push(intersection.id);
  });

  // Set the distance to the start intersection to 0.
  distances[startId] = 0;

  // Process the queue until empty or until the end intersection is reached.
  while (queue.length > 0) {
    // Sort the queue based on the shortest distance.
    queue.sort((a, b) => distances[a] - distances[b]);
    const current = queue.shift()!;

    // If the current node is the destination, break out of the loop.
    if (current === endId) break;

    // Iterate through the roads to find connected intersections.
    roads.forEach((road: any) => {
      if (road.start === current || road.end === current) {
        const neighbor = road.start === current ? road.end : road.start;
        const alt = distances[current] + road.length;

        // Update the distance and previous node if a shorter path is found.
        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = current;
        }
      }
    });
  }

  // Reconstruct the shortest path from the end intersection to the start.
  const path: number[] = [];
  let u = endId;

  while (previous[u] !== null) {
    path.unshift(u);
    u = previous[u]!;
  }

  if (u === startId) path.unshift(u);

  // Return the path and the total distance, or null if no path is found.
  return path.length > 0 ? { path, distance: distances[endId] } : null;
}

/**
 * Handles GET requests to calculate the shortest path between two intersections.
 * 
 * Query Parameters:
 * - `start`: The ID of the starting intersection (required).
 * - `end`: The ID of the destination intersection (required).
 * 
 * Example:
 * GET /api/calculate-route?start=1&end=8
 * 
 * Response:
 * - 200 OK: { path: [1, 2, 3, 8], distance: 300 }
 * - 400 Bad Request: { error: 'Please provide start and end points' }
 * - 404 Not Found: { error: 'No path found' }
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const start = url.searchParams.get('start');
  const end = url.searchParams.get('end');

  // Validate query parameters.
  if (!start || !end) {
    return NextResponse.json({ error: 'Please provide start and end points' }, { status: 400 });
  }

  const startId = parseInt(start);
  const endId = parseInt(end);

  // Fetch map data and compute the shortest path.
  const mapData = getMapData();
  const result = dijkstra(mapData, startId, endId);

  if (result) {
    return NextResponse.json(result);
  } else {
    return NextResponse.json({ error: 'No path found' }, { status: 404 });
  }
}
