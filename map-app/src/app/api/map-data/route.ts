import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  // Crée le chemin vers le fichier JSON
  const filePath = path.join(process.cwd(), 'data', 'mapData.json');

  // Lis le fichier JSON
  const jsonData = fs.readFileSync(filePath, 'utf-8');

  // Parse les données JSON
  const data = JSON.parse(jsonData);

  // Retourne les données
  return NextResponse.json(data);
}
