import { CSSProperties, useState } from 'react';
import { useRouter } from 'next/router';

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
  const [camID, setcamID] = useState('');
  const [numberPlate, setNumberPlate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Generate the current time in the same format as MongoDB example
      const currentTime = new Date().toISOString(); // Converts to '2024-11-17T23:00:00.000Z' format

      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          camID,
          time: currentTime, // Use the generated timestamp
          numberPlate,
        }),
      });

      if (response.ok) {
        setSuccessMessage('Video created successfully!');
        setcamID('');
        setNumberPlate('');
        router.push('/videos'); // Redirect to videos page after creation
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Failed to create video');
      }
    } catch {
      setErrorMessage('An error occurred while creating the video');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Create New Video</h1>

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
            value={camID}
            onChange={(e) => setcamID(e.target.value)}
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
            value={numberPlate}
            onChange={(e) => setNumberPlate(e.target.value)}
            required
          />
        </div>

        <button style={styles.button} type="submit">
          Create Video
        </button>
      </form>
    </div>
  );
}

// This function gets called at request time for server-side rendering
export async function getServerSideProps() {
  // You can fetch data here if you need to provide initial data to the page
  return { props: {} };
}
