import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
      const data = await req.json();
      const { available, cameraName, cameraNumber, position } = data;
  
      if (position.length !== 2) {
        return NextResponse.json({ error: 'Invalid position data' }, { status: 400 });
      }
  
      const [latitude, longitude] = position;
  
      if (isNaN(latitude) || isNaN(longitude)) {
        return NextResponse.json({ error: 'Latitude and longitude must be numbers' }, { status: 400 });
      }
  
      const newCamera = await prisma.cameras.create({
        data: {
          available,
          cameraName,
          cameraNumber,
          position: [latitude.toString(), longitude.toString()],
        },
      });
  
      return NextResponse.json(newCamera);
    } catch {
      return NextResponse.json({ error: 'Failed to create camera' }, { status: 500 });
    }
  }
  