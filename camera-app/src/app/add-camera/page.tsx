'use client';

import { CSSProperties, useState } from 'react';
import { useRouter } from 'next/navigation';

const styles: { [key: string]: CSSProperties } = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '1rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
    marginBottom: '1rem',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#0070f3',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 'bold',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
  },
  errorMessage: {
    color: 'red',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  successMessage: {
    color: 'green',
    marginBottom: '1rem',
    textAlign: 'center',
  },
};

export default function AddCameraPage() {
  const [cameraName, setCameraName] = useState('');
  const [cameraNumber, setCameraNumber] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/add-camera', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cameraName,
          cameraNumber,
          position: [latitude, longitude], // Combine latitude and longitude into an array
        }),
      });

      if (response.ok) {
        setSuccessMessage('Camera added successfully!');
        setCameraName('');
        setCameraNumber('');
        setLatitude('');
        setLongitude('');
        router.push('/cameras'); // Redirect to cameras page after adding
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Failed to add camera');
      }
    } catch (error) {
      setErrorMessage('An error occurred while adding the camera');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Add New Camera</h1>

      {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
      {successMessage && <p style={styles.successMessage}>{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="cameraName">
            Camera Name
          </label>
          <input
            style={styles.input}
            type="text"
            id="cameraName"
            value={cameraName}
            onChange={(e) => setCameraName(e.target.value)}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="cameraNumber">
            Camera Number
          </label>
          <input
            style={styles.input}
            type="text"
            id="cameraNumber"
            value={cameraNumber}
            onChange={(e) => setCameraNumber(e.target.value)}
            required
          />
        </div>

        {/* Latitude Input */}
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="latitude">
            Latitude
          </label>
          <input
            style={styles.input}
            type="number"
            id="latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            required
          />
        </div>

        {/* Longitude Input */}
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="longitude">
            Longitude
          </label>
          <input
            style={styles.input}
            type="number"
            id="longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            required
          />
        </div>

        <button style={styles.button} type="submit">
          Add Camera
        </button>
      </form>
    </div>
  );
}
