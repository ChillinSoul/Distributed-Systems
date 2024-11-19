import React, { useState } from 'react';
//import logo from './logo.svg';
import './App.css';

function App() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Fonction générique pour récupérer le résultat d'une API
  const getResult = (route) => {
    fetch(route)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
          setResult(null);
        } else {
          setResult(data.result);
          setError(null);
        }
      })
      .catch(error => {
        console.error('Erreur:', error);
        setError("Erreur lors de la récupération des données.");
      });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Tester plusieurs routes d'API</h1>
      
      {/* Boutons pour appeler les différentes routes */}
      <button onClick={() => getResult('/api/addition?a=5&b=3')}>
        Addition (5 + 3)
      </button>
      <br />
      {/* <button onClick={() => getResult('http://backend-service:5000/api/soustraction?a=5&b=3')}>
        Soustraction (5 - 3)
      </button>ll
      <br /> */}

      {error && <p style={{ color: "red" }}>{error}</p>}
      {result !== null && <p>Resultat: {result}</p>}
    </div>
  );
}
export default App;
