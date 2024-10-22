import Head from "next/head";
import SvgMap from "./components/map";

const Home: React.FC = () => {
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
        <SvgMap />
      </main>
    </div>
  );
};

export default Home;
