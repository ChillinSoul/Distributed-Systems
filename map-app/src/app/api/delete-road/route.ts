import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request): Promise<NextResponse> {
  const prisma = new PrismaClient();

  try {
    // Extraire les paramètres de requête
    const { searchParams } = new URL(request.url);
    const roadId = parseInt(searchParams.get('id') || '');

    // Validation de l'ID
    if (isNaN(roadId)) {
      return NextResponse.json(
        { error: 'A valid road ID is required.' },
        { status: 400 }
      );
    }

    // Suppression de la route
    const deletedRoad = await prisma.roads.delete({
      where: { id: roadId },
    });

    // Réponse en cas de succès
    return NextResponse.json({
      message: 'Road deleted successfully.',
      road: deletedRoad,
    });
  } catch (error) {
    // Vérification du type de l'erreur
    if (error instanceof Error) {
      console.error('Error deleting road:', error.message);
      return NextResponse.json(
        { error: 'Failed to delete road.', details: error.message },
        { status: 500 }
      );
    }

    // Réponse par défaut pour les erreurs inconnues
    console.error('Unknown error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  } finally {
    // Déconnecter Prisma
    await prisma.$disconnect();
  }
}
