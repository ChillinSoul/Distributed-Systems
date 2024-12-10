import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const prisma = new PrismaClient();

  try {
    // Extraire les paramètres de la requête
    const { searchParams } = new URL(request.url);
    const roadId = parseInt(searchParams.get('id') || '', 10);
    const oneWay = searchParams.get('one_way') === 'true';
    const direction = searchParams.get('direction') || null;

    // Validation des données
    if (isNaN(roadId)) {
      return NextResponse.json(
        { error: 'A valid road ID is required.' },
        { status: 400 }
      );
    }

    const roadExists = await prisma.roads.findUnique({
        where: { id: roadId },
      });
      
      if (!roadExists) {
        return NextResponse.json(
          { error: `Road with ID ${roadId} does not exist.` },
          { status: 404 }
        );
      }

      
    if (oneWay && (!direction || (direction !== 'start_to_end' && direction !== 'end_to_start'))) {
      return NextResponse.json(
        { error: 'For one-way roads, a valid direction ("start_to_end" or "end_to_start") is required.' },
        { status: 400 }
      );
    }

    // Mise à jour de la route
    const updatedRoad = await prisma.roads.update({
      where: { id: roadId },
      data: { one_way: oneWay, direction },
    });

    return NextResponse.json({
      message: 'Road updated successfully.',
      road: updatedRoad,
    });
  } catch (error) {
    console.error('Error updating road:', error);
    return NextResponse.json(
      { error: 'Failed to update road.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
