'use client';

import { CSSProperties, useState } from 'react';

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

export default function CreateVideoPage() {
  const [cameranumber, setCameranumber] = useState('');
  const [numberplate, setNumberPlate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/create-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "cameranumber": cameranumber,
          "numberplate": numberplate,
        }),
      });

      if (response.ok) {
        setSuccessMessage('Video added successfully!');
        setCameranumber('');
        setNumberPlate('');
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Failed to add video');
      }
    } catch {
      setErrorMessage('An error occurred while adding the video');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Add New Video</h1>

      {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
      {successMessage && <p style={styles.successMessage}>{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="camID">
            Camera ID
          </label>
          <input
            style={styles.input}
            type="text"
            id="camID"
            value={cameranumber}
            onChange={(e) => setCameranumber(e.target.value)}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="numberPlate">
            Number Plate
          </label>
          <input
            style={styles.input}
            type="text"
            id="numberPlate"
            value={numberplate}
            onChange={(e) => setNumberPlate(e.target.value)}
            required
          />
        </div>

        <button style={styles.button} type="submit">
          Add Video
        </button>
      </form>
    </div>
  );
}
