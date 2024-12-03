import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET() {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    return NextResponse.json('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json({ error: error }, { status: 500 });
  }finally {
    await prisma.$disconnect();
  }
}
