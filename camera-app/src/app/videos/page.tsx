'use client';
import { CSSProperties, useEffect, useState } from 'react';

interface Video {
  id: string;
  cameranumber: string;
  numberplate: string;
  typevehicule: string;
  createat: string;
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '1rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    fontSize: '2.5rem',
    margin: '2rem 0',
    color: '#333',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    fontSize: '1.25rem',
    margin: '1rem 0',
    borderBottom: '1px solid #eee',
    paddingBottom: '1rem',
    padding: '0.5rem',
    backgroundColor: '#fff',
    borderRadius: '4px',
    boxShadow: '0 1px 5px rgba(0, 0, 0, 0.05)',
  },
  videoInfo: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    color: '#333',
  },
  videoDetails: {
    color: '#555',
    fontSize: '1rem',
    marginTop: '0.5rem',
  },
};

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch the data from the API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/videos');
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    
    <div style={styles.container}>
      <h1 style={styles.heading}>Videos List</h1>
      {videos.length === 0 ? (
        <p>No videos found</p>
      ) : (
        <ul style={styles.list}>
          {videos.map((video) => (
            <li key={video.id} style={styles.listItem}>
              <div style={styles.videoInfo}>Video ID: {video.id}</div>
              <div style={styles.videoDetails}>Camera Number: {video.cameranumber}</div>
              <div style={styles.videoDetails}>
                Number Plate: {video.numberplate}
              </div>
              <div style={styles.videoDetails}>
                Type of vehicle: {video.typevehicule}
              </div>
              <div style={styles.videoDetails}>
                Time: {video.createat}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
