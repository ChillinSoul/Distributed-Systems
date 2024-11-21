'use client';
import { CSSProperties, useEffect, useState } from 'react';
interface Camera {
  id: string;
  available: boolean;
  cameraName: string;
  cameraNumber: string;
  position: string[];
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
    cameraName: {
        fontWeight: 'bold',
        fontSize: '1.5rem',
        color: '#333',
    },
    cameraNumber: {
        color: '#777',
        fontSize: '1rem',
        marginTop: '0.5rem',
    },
    position: {
        color: '#555',
        fontSize: '1rem',
        marginTop: '0.5rem',
    }
};
export default function CamerasPage() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // Fetch the data from the API
  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const response = await fetch('/api/cameras');
        const data = await response.json();
        setCameras(data);
      } catch (error) {
        console.error('Error fetching cameras:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCameras();
  }, []);
  if (loading) return <div>Loading...</div>;
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Cameras List</h1>
      {cameras.length === 0 ? (
        <p>No cameras found</p>
      ) : (
        <ul style={styles.list}>
          {cameras.map((camera) => (
            <li key={camera.id} style={styles.listItem}>
              <div style={styles.cameraName}>{camera.cameraName}</div>
              <div style={styles.cameraNumber}>Number: {camera.cameraNumber}</div>
              <div style={styles.position}>
                Position: {camera.position.join(', ')}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}