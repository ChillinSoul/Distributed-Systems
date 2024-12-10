"use client";

import { useRouter } from "next/navigation"; // For navigation
import { LoginFormSchema } from "@/lib/definitions";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/action/auth";
import { LoginInput } from "@/lib/form/definitions";

export default function Login() {
  const router = useRouter(); // Initialize router

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginFormSchema),
  });

  const onLogin = (data: FieldValues) => {
    login(data as LoginInput);
  }

  // Handle authentication
  // const handleAuth = () => {
  //   if (email === "admin@hotmail.com" && password === "password") {
  //     setIsAuthenticated(true);
  //     alert("Authentication successful!");
  //     router.push("/Formulas"); //Redirect to Formulas page after sign up
  //   } else {
  //     alert("Invalid credentials!");
  //   }
  // };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8 bg-gradient-to-br from-indigo-500 to-teal-500 text-white font-sans">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-4xl font-bold mb-4">📊 Mini-Metrics Dashboard</h1>
        <p className="text-lg">
          Empowering Light Traffic Monitoring with Real-Time Calculations. Use Mini-Metrics to analyze traffic data like the number of cars passing, calculate custom formulas, and monitor efficiently in Minikube!
        </p>
      </header>

      {/* Authentication Section */}
      
      <div className="w-full max-w-md bg-white text-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">🔒 User Authentication</h2>
        <form onSubmit={handleSubmit(onLogin)}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email:
            </label>
            <input
              id="email"
              type="text"
              //value={email}
              //onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
              {...register("email")}
            />
            <p>{errors.email?.message?.toString()}</p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Password:
            </label>
            <input
              id="password"
              type="password"
              // value={password}
              // onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
              {...register("password")}
            />
            <p>{errors.password?.message?.toString()}</p>
          </div>
          <button
            type="submit"
            //onClick={handleAuth}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-500 transition"
          >
            Log In
          </button>
          <div className="mt-4 text-center">
            <p className="text-sm">
              {"Don't have an account? "}
              <button
                onClick={() => router.push("/Signup")}
                className="text-blue-600 hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>
        </form>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm mt-12 opacity-75">
        © 2024 Mini-Metrics • Built for Light Traffic Monitoring in Minikube
      </footer>
    </div>
  );
}
