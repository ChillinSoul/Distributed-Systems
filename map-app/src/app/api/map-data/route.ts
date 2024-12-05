import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET() {
  const prisma = new PrismaClient();

  try {
    // Connect to the database
    await prisma.$connect();

    // Fetch data from the tables
    const intersections = await prisma.intersections.findMany(); // Remplacez "intersections" par le nom exact de la table
    const roads = await prisma.roads.findMany(); // Remplacez "roads" par le nom exact de la table

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

const dataPath = path.join(process.cwd(), "data", "mapData.json");

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json(); // Récupère l'ID de la route depuis le corps de la requête

    // Lire les données actuelles
    const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

    // Vérifier si la route existe
    const roadExists = data.roads.some((road: { id: number }) => road.id === id);
    if (!roadExists) {
      return NextResponse.json({ success: false, message: "Route introuvable" }, { status: 404 });
    }

    // Filtrer les routes pour supprimer celle avec l'ID correspondant
    const updatedRoads = data.roads.filter((road: { id: number }) => road.id !== id);

    // Mettre à jour les données et réécrire dans le fichier JSON
    fs.writeFileSync(
      dataPath,
      JSON.stringify({ ...data, roads: updatedRoads }, null, 2),
      "utf-8"
    );

    return NextResponse.json({ success: true, message: "Route supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la route :", error);
    return NextResponse.json(
      { success: false, message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, underConstruction } = await request.json();

    // Lire le fichier JSON
    const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

    // Rechercher la route et mettre à jour son état
    const updatedRoads = data.roads.map((road: any) => {
      if (road.id === id) {
        return { ...road, underConstruction };
      }
      return road;
    });

    // Sauvegarder les modifications dans le fichier
    fs.writeFileSync(
      dataPath,
      JSON.stringify({ ...data, roads: updatedRoads }, null, 2),
      "utf-8"
    );

    return NextResponse.json({ success: true, message: "Mise à jour réussie" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    return NextResponse.json(
      { success: false, message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
