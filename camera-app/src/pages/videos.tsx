import { GetServerSideProps } from 'next';

interface Video {
  id: string;
  camId: string;
  time: string;
  numberPlate: string;
}

interface VideosPageProps {
  videos: Video[];
}

export default function VideosPage({ videos }: VideosPageProps) {
  return (
    <div>
      <h1>All Videos</h1>
      {videos.length === 0 ? (
        <p>No videos found.</p>
      ) : (
        <ul>
          {videos.map((video) => (
            <li key={video.id}>
              <p>Cam ID: {video.camId}</p>
              <p>Time: {new Date(video.time).toLocaleString()}</p>
              <p>Number Plate: {video.numberPlate}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/videos'); // Update to your API endpoint if necessary
    const videos = await res.json();

    return {
      props: {
        videos,
      },
    };
  } catch (error) {
    console.error('Error fetching videos:', error);
    return {
      props: {
        videos: [],
      },
    };
  }
};
