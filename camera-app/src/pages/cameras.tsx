
import { GetServerSideProps } from 'next';
import { CSSProperties } from 'react';

interface Camera {
  id: string;
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
  },
};

export default function CamerasPage({ cameras }: { cameras: Camera[] }) {
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
              <div style={styles.position}>Position: {camera.position.join(', ')}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch('http://camera-app-service/api/cameras');
  const cameras = await res.json();

  return { props: { cameras } };
};
