import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const cache: { [key: string]: number[] } = {};

export async function GET(request: Request) {
  const prisma = new PrismaClient();

  try {
    const { searchParams } = new URL(request.url);
    const startId = parseInt(searchParams.get('start') || '');
    const endId = parseInt(searchParams.get('end') || '');

    if (isNaN(startId) || isNaN(endId)) {
      return NextResponse.json(
        { error: 'Start and End intersection IDs are required and must be valid numbers.' },
        { status: 400 }
      );
    }

    const cacheKey = `${startId}-${endId}`;
    if (cache[cacheKey]) {
      console.log('Cache hit for path:', cacheKey);
      return NextResponse.json(cache[cacheKey]);
    }

    // Fetch all roads and intersections from the database
    const intersections = await prisma.intersections.findMany();
    const roads = await prisma.roads.findMany();

    // Build graph representation considering road usability and directionality
    const graph: { [key: number]: { [key: number]: number } } = {};
    roads.forEach((road) => {
      if (road.useable) {
        if (road.one_way) {
          if (road.direction === 'start_to_end') {
            if (!graph[road.start_intersection]) graph[road.start_intersection] = {};
            graph[road.start_intersection][road.end_intersection] = road.length;
          } else if (road.direction === 'end_to_start') {
            if (!graph[road.end_intersection]) graph[road.end_intersection] = {};
            graph[road.end_intersection][road.start_intersection] = road.length;
          }
        } else {
          if (!graph[road.start_intersection]) graph[road.start_intersection] = {};
          if (!graph[road.end_intersection]) graph[road.end_intersection] = {};
          graph[road.start_intersection][road.end_intersection] = road.length;
          graph[road.end_intersection][road.start_intersection] = road.length;
        }
      }
    });

    // Dijkstra's algorithm to find the shortest path
    const shortestPath = dijkstra(graph, startId, endId);

    // Cache the result
    cache[cacheKey] = shortestPath;

    // Find intersections in the path
    const pathIntersections = shortestPath.map((id) =>
      intersections.find((intersection) => intersection.id === id)
    );

    return NextResponse.json(pathIntersections);
  } catch (error) {
    console.error('Error calculating route:', error);
    return NextResponse.json({ error: 'Error calculating route.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// Dijkstra's algorithm implementation
function dijkstra(graph: { [key: number]: { [key: number]: number } }, start: number, end: number) {
  const distances: { [key: number]: number } = {};
  const previous: { [key: number]: number | null } = {};
  const queue: number[] = Object.keys(graph).map(Number); // Convert Set to array

  Object.keys(graph).forEach((node) => {
    distances[parseInt(node)] = Infinity;
    previous[parseInt(node)] = null;
  });
  distances[start] = 0;

  while (queue.length > 0) {
    const currentNode = queue.reduce((minNode, node) =>
      distances[node] < distances[minNode] ? node : minNode
    );

    queue.splice(queue.indexOf(currentNode), 1); // Remove currentNode from queue

    if (currentNode === end) break;

    Object.entries(graph[currentNode] || {}).forEach(([neighbor, length]) => {
      const alt = distances[currentNode] + length;
      if (alt < distances[parseInt(neighbor)]) {
        distances[parseInt(neighbor)] = alt;
        previous[parseInt(neighbor)] = currentNode;
      }
    });
  }

  const path = [];
  let currentNode: number | null = end;
  while (currentNode !== null) {
    path.unshift(currentNode);
    currentNode = previous[currentNode];
  }

  return path;
}