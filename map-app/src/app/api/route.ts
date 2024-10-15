import { NextResponse } from 'next/server';

export async function GET() {
  const data = {
    message: 'Hello from Next.js API!',
    status: 'success',
  };
  console.log("Getting map data")
  return NextResponse.json(data);
}

  