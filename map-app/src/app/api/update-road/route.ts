import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const prisma = new PrismaClient();

  try {
    const { searchParams } = new URL(request.url);
    const roadId = parseInt(searchParams.get('id') || '');
    const useable = searchParams.get('useable') === 'true';

    if (isNaN(roadId)) {
      return NextResponse.json(
        { error: 'A valid road ID is required.' },
        { status: 400 }
      );
    }

    // Update the road's useable status in the database
    const updatedRoad = await prisma.roads.update({
      where: { id: roadId },
      data: { useable },
    });

    return NextResponse.json({
      message: 'Road updated successfully.',
      road: updatedRoad,
    });
  } catch (error) {
    console.error('Error updating road:', error);
    return NextResponse.json({ error: 'Failed to update road.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
