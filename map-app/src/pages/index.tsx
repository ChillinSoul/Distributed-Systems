import React, { useState } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import SvgMap from "../components/map";
import DeleteRoad from "../components/DeleteRoad";
import { MapData } from "../types/map";
import { Road } from "../types/map";
import { Intersection } from "../types/map";
import ToggleRoadConstruction from "../components/ToggleRoadConstruction";

const Home: React.FC<{ mapData: MapData }> = ({ mapData }) => {
  const [roads, setRoads] = useState<Road[]>(mapData.roads);

  const handleRoadDelete = (updatedRoads: Road[]) => {
    setRoads(updatedRoads);
  };

  const handleRoadUnderConstruction = (updatedRoads: Road[]) => {
    setRoads(updatedRoads);
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
        <SvgMap mapData={{ intersections: mapData.intersections, roads }} />
        <DeleteRoad roads={roads} onRoadDelete={handleRoadDelete} />
        <ToggleRoadConstruction
          roads={roads}
          onRoadUpdate={handleRoadUnderConstruction}
        />
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch("http://localhost:3000/api/map-data");
  const rawData = await res.json();

  // Transformation des données
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
    })),
  };

  return { props: { mapData } };
};

export default Home;
