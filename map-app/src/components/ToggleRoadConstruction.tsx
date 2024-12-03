import React, { useState } from "react";
import { Road } from "../types/map"; // Assurez-vous que l'interface Road est importée correctement

interface ToggleRoadConstructionProps {
  roads: Road[];
  onRoadUpdate: (updatedRoads: Road[]) => void;
}

const ToggleRoadConstruction: React.FC<ToggleRoadConstructionProps> = ({
  roads,
  onRoadUpdate,
}) => {
  const [selectedRoad, setSelectedRoad] = useState<number | null>(null);
  const [isUnderConstruction, setIsUnderConstruction] = useState(false);

  const handleUpdate = async () => {
    if (selectedRoad === null) {
      alert("Veuillez sélectionner une route.");
      return;
    }

    const response = await fetch("/api/map-data", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: selectedRoad,
        underConstruction: isUnderConstruction,
      }),
    });

    const result = await response.json();

    if (result.success) {
      const updatedRoads = roads.map((road) =>
        road.id === selectedRoad
          ? { ...road, underConstruction: isUnderConstruction }
          : road
      );
      onRoadUpdate(updatedRoads);
      alert("État de la route mis à jour.");
    } else {
      alert("Erreur lors de la mise à jour.");
    }
  };

  return (
    <div>
      <h2>Mettre à jour l'état de la route</h2>
      <select
        onChange={(e) => setSelectedRoad(Number(e.target.value))}
        value={selectedRoad || ""}
      >
        <option value="" disabled>
          Sélectionnez une route
        </option>
        {roads.map((road) => (
          <option key={road.id} value={road.id}>
            Route {road.id} (
            {road.underConstruction ? "En travaux" : "Disponible"})
          </option>
        ))}
      </select>
      <label style={{ marginLeft: "10px" }}>
        <input
          type="checkbox"
          checked={isUnderConstruction}
          onChange={(e) => setIsUnderConstruction(e.target.checked)}
        />
        En travaux
      </label>
      <button onClick={handleUpdate} style={{ marginLeft: "10px" }}>
        Mettre à jour
      </button>
    </div>
  );
};

export default ToggleRoadConstruction;
