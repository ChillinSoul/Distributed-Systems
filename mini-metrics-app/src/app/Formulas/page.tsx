"use client";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { type FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormulaFormSchema } from "@/lib/definitions";
import type { FormulaInput } from "@/lib/form/definitions";
// import { createFormulaDTO, getFormulaListDTO, getFormulaResultsDTO } from "@/lib/dto/formula_dto";
import { Formula } from "@prisma/client";
import { createFormula, getFormulaList, getFormulaResults } from "@/action/formula";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function FormulasPage() {
  // const [formulas, setFormulas] = useState<string[]>(["a + b", "a - b"]);
  const [formulas, setFormulas] = useState<Formula[]>([]);
  // const [newFormula, setNewFormula] = useState<string>("");
  const [appliedFormula, setAppliedFormula] = useState<string>();
  const [graphData, setGraphData] = useState<number[]>([]);
  const [labels, setLabels] = useState<number[]>([]);

  // Generate dummy data for graph on formula apply
  const applyFormula = async (formulaObj: Formula) => {
    setAppliedFormula(formulaObj.formula);
    
    const formulaWithResults = await getFormulaResults(formulaObj.id);
    if (formulaWithResults) {
      const data = Array.from({ length: formulaWithResults.results.length }, (_, i) => {
        const result = JSON.parse(formulaWithResults.results[i].result!.toString()) as number;
        return result;
      });
      const timeLabels = Array.from({ length: formulaWithResults.results.length }, (_, i) => {
        const result = formulaWithResults.results[i].createdAt;
        return result.getMinutes();
      });

      setGraphData(data);
      setLabels(timeLabels);
    } else {
      // const dummyData = Array.from({ length: 10 }, () => Math.random() * 10);
      // const timeLabels = Array.from({ length: 10 }, (_, i) => i * 5); // Time in minutes
      
      // setGraphData(dummyData);
      // setLabels(timeLabels);
    }
  };

  // const addNewFormula = () => {
  //   if (newFormula.trim()) {
  //     setFormulas((prev) => [...prev, newFormula]);
  //     setNewFormula("");
  //   }
  // };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(FormulaFormSchema),
  });

  const onNewFormula = async (data: FieldValues) => {
    const formulaInput = data as FormulaInput;
    const formula = await createFormula(formulaInput);
    if (formula) {
      const formulaList = await getFormulaList()
      if (formulaList) setFormulas(formulaList)
    }
  }

  // Data for Chart.js
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: `Graph for: ${appliedFormula}`,
        data: graphData,
        fill: false,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Dynamic Formula Graph",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time (minutes)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Value",
        },
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      const formulaList = await getFormulaList();
      if (formulaList) setFormulas(formulaList);
    }
    
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 p-6">
      <h1 className="text-3xl font-bold text-indigo-600 mb-6">Formulas Dashboard</h1>

      {/* List of Existing Formulas */}
      <div className="w-full max-w-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Existing Formulas</h2>
        <ul className="list-disc pl-5 space-y-2">
          {formulas.map((formula, index) => (
            <li key={index} className="flex justify-between items-center">
              <span>{formula.formula}</span>
              <button
                onClick={() => applyFormula(formula)}
                className="font-bold text-indigo-600 hover:underline"
              >
                Apply
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Create New Formula */}
      <div className="w-full max-w-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Create a new Formula</h2>
        <form onSubmit={handleSubmit(onNewFormula)}>
          <div className="flex space-x-4">
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="Enter a formula (e.g., x + y)"
              {...register("formula")}
            />
            <p className="text-red-500">{errors.formula?.message?.toString()}</p>
            <button
              type="submit"
              // onClick={addNewFormula}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
            >
              Add
            </button>
          </div>
        </form>
      </div>

      {/* Graph Section */}
      {appliedFormula && (
        <div className="w-full max-w-lg">
          <h2 className="text-xl font-semibold mb-4">
            Graph for: <span className="text-blue-600">{appliedFormula}</span>
          </h2>
          <div className="w-full bg-white shadow-md rounded-md p-4">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}
      {/* Footer */}
      <footer className="text-center text-sm mt-12 opacity-75">
        © 2024 Mini-Metrics • Built for Light Traffic Monitoring in Minikube
      </footer>
    </div>
  );
}
