"use client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 p-6">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-blue-600">Welcome to Mini Metrics</h1>
        <p className="text-lg">
          Mini Metrics is a lightweight traffic analytics platform designed for Minikube clusters. 
          Calculate traffic formulas, such as the number of cars passing a camera in a specific period, 
          or create custom metrics tailored to your needs.
        </p>

        <p className="text-lg">
          Get started by signing up for an account to access prebuilt formulas or create your own metrics. 
          Already have an account? Log in to get started.
        </p>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => router.push("/Signup")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500 transition"
          >
            Sign Up
          </button>
          <button
            onClick={() => router.push("/Login")}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg shadow-md hover:bg-gray-200 transition"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
