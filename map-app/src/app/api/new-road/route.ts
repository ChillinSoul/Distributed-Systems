import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const prisma = new PrismaClient();

  try {
    // Extraire les paramètres depuis l'URL
    const { searchParams } = new URL(request.url);

    const startIntersection = parseInt(searchParams.get('start_intersection') || '', 10);
    const endIntersection = parseInt(searchParams.get('end_intersection') || '', 10);
    const length = parseInt(searchParams.get('length') || '', 10);
    const useable = searchParams.get('useable') === 'true';

    // Log des données d'entrée pour debug
    console.log("Données reçues : ")
    console.log({
      start_intersection: startIntersection,
      end_intersection: endIntersection,
      length,
      useable,
    });

    // Validation des données
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

    // Vérification que les intersections existent
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

    // Créer une nouvelle route
    const newRoad = await prisma.roads.create({
      data: {
        start_intersection: startIntersection,
        end_intersection: endIntersection,
        length,
        useable, // Par défaut `true` si non spécifié
      },
    });

    // Retourner une réponse de succès
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
