import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET() {
  const prisma = new PrismaClient();

  try {
    // Connect to the database
    await prisma.$connect();

    // Fetch data from the tables
    const intersections = await prisma.intersections.findMany();
    const roads = await prisma.roads.findMany();

    // Combine the data from both tables into a single response
    const data = {
      intersections,
      roads,
    };

    // Return the data as JSON
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: error }, { status: 500 });
  } finally {
    // Ensure the Prisma client disconnects
    await prisma.$disconnect();
  }
}