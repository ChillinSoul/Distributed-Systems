import React, { useState } from "react";
import { Road } from "../types/map";

interface DeleteRoadProps {
  roads: Road[];
  onRoadDelete: (updatedRoads: Road[]) => void;
}

const DeleteRoad: React.FC<DeleteRoadProps> = ({ roads, onRoadDelete }) => {
  const [selectedRoad, setSelectedRoad] = useState<number | null>(null);

  const handleDelete = async () => {
    if (selectedRoad === null) {
      alert("Veuillez sélectionner une route à supprimer.");
      return;
    }

    const response = await fetch("/api/map-data", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedRoad }),
    });

    const result = await response.json();
    if (result.success) {
      const updatedRoads = roads.filter((road) => road.id !== selectedRoad);
      onRoadDelete(updatedRoads);
      alert("Route supprimée avec succès.");
    } else {
      alert("Erreur lors de la suppression de la route.");
    }
  };

  return (
    <div>
      <h2>Supprimer une route</h2>
      <select
        onChange={(e) => setSelectedRoad(Number(e.target.value))}
        value={selectedRoad || ""}
      >
        <option value="" disabled>
          Sélectionnez une route
        </option>
        {roads.map((road) => (
          <option key={road.id} value={road.id}>
            Route {road.id} (Longueur: {road.length})
          </option>
        ))}
      </select>
      <button onClick={handleDelete} style={{ marginLeft: "10px" }}>
        Supprimer
      </button>
    </div>
  );
};

export default DeleteRoad;
