import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const prisma = new PrismaClient();

  try {
    // Extract parameters from the request URL
    const { searchParams } = new URL(request.url);

    const startIntersection = parseInt(searchParams.get('start_intersection') || '', 10);
    const endIntersection = parseInt(searchParams.get('end_intersection') || '', 10);
    const length = parseInt(searchParams.get('length') || '', 10);
    const useable = searchParams.get('useable') === 'true';
    const oneWay = searchParams.get('one_way') === 'true';
    const direction = searchParams.get('direction') || null;

    // Log incoming data for debugging
    console.log('Received Data:', {
      start_intersection: startIntersection,
      end_intersection: endIntersection,
      length,
      useable,
      one_way: oneWay,
      direction,
    });

    // Validation of required parameters
    if (isNaN(startIntersection) || isNaN(endIntersection) || isNaN(length)) {
      return NextResponse.json(
        { error: 'Valid start_intersection, end_intersection, and length are required.' },
        { status: 400 }
      );
    }

    if (startIntersection === endIntersection) {
      return NextResponse.json(
        { error: 'Start and end intersections must be different.' },
        { status: 400 }
      );
    }

    if (oneWay && (!direction || (direction !== 'start_to_end' && direction !== 'end_to_start'))) {
      return NextResponse.json(
        { error: 'For one-way roads, a valid direction ("start_to_end" or "end_to_start") is required.' },
        { status: 400 }
      );
    }

    // Check if intersections exist
    const startExists = await prisma.intersections.findUnique({
      where: { id: startIntersection },
    });
    const endExists = await prisma.intersections.findUnique({
      where: { id: endIntersection },
    });

    if (!startExists || !endExists) {
      return NextResponse.json(
        { error: 'Start or end intersection does not exist.' },
        { status: 404 }
      );
    }

    // Create the new road
    const newRoad = await prisma.roads.create({
      data: {
        start_intersection: startIntersection,
        end_intersection: endIntersection,
        length,
        useable, // Default is true if not specified
        one_way: oneWay, // Default is false if not specified
        direction, // Null for two-way roads
      },
    });

    // Return success response
    return NextResponse.json({
      message: 'Road created successfully.',
      road: newRoad,
    });
  } catch (error) {
    console.error('Error creating road:', error);
    return NextResponse.json(
      { error: 'Failed to create road.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
