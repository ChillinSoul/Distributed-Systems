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
  // To fetch data IN KUBERNETES use this path : http://localhost:3000/api/map-data
  // It is a different path than the path you write in the url to access to the API which is : http://localhost/map-app/api/map-data
  const res = await fetch("http://localhost:3000/api/map-data");
  const mapData: MapData = await res.json();

  return { props: { mapData } };
};

export default Home;
