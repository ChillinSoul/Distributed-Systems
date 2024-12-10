import { GetServerSideProps } from "next";
import Head from "next/head";
import SvgMap from "../components/map";

interface Intersection {
  id: number;
  name: string;
  coordinates: [number, number];
}

interface Road {
  id: number;
  start: number;
  end: number;
  length: number;
  useable: boolean;
  oneWay: boolean;
  direction: string | null;
}

interface MapData {
  intersections: Intersection[];
  roads: Road[];
}

const Home: React.FC<{ mapData: MapData }> = ({ mapData }) => {
  const handleRoadClick = async (road: Road) => {
    const newUseableValue = !road.useable; // Inverse la valeur actuelle

    try {
      // Requête POST pour mettre à jour la route
      await fetch(
        `http://localhost/map-app/api/update-road?id=${road.id}&useable=${newUseableValue}`,
        {
          method: "POST",
        }
      );
    } catch (err) {
      console.error("Error updating road:", err);
    }
  };

  return (
    <div>
      <Head>
        <title>SVG Map Visualization</title>
        <meta
          name="description"
          content="Displaying a map with roads and intersections using SVG"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ padding: "20px" }}>
        <h1>Map Visualization</h1>
        <SvgMap mapData={mapData} onRoadClick={handleRoadClick} />
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch("http://localhost:3000/api/map-data");
  const rawData = await res.json();

  const mapData: MapData = {
    intersections: rawData.intersections.map((intersection: any) => ({
      id: intersection.id,
      name: intersection.name,
      coordinates: [intersection.x_coordinate, intersection.y_coordinate],
    })),
    roads: rawData.roads.map((road: any) => ({
      id: road.id,
      start: road.start_intersection,
      end: road.end_intersection,
      length: road.length,
      useable: road.useable,
      oneWay: road.one_way,
      direction: road.direction,
    })),
  };

  return { props: { mapData } };
};

export default Home;
