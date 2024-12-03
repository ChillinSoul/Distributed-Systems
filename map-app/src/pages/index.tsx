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
}

interface MapData {
  intersections: Intersection[];
  roads: Road[];
}

const Home: React.FC<{ mapData: MapData }> = ({ mapData }) => {
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
        <SvgMap mapData={mapData} />
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch("http://localhost/map-app/api/map-data"); // locally: http://localhost:3000/api/map-data
  const mapData: MapData = await res.json();

  return { props: { mapData } };
};

export default Home;
