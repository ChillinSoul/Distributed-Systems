"use client";
// import { useState } from "react";
import { useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupFormSchema } from "@/lib/definitions";
import { signUp } from "@/action/auth";
import { SignupInput } from "@/lib/form/definitions";
// import { empty } from "@prisma/client/runtime/library";

export default function SignUp() {
  // const [username, setUsername] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignupFormSchema),
  });

  // const handleSignUp = () => {
    // if (password is empty) {
    //     alert("Passwords do not match!");
    //     router.push("/Signup");
    //   }
  //   if (password !== confirmPassword) {
  //     alert("Passwords do not match!");
  //     router.push("/Signup");
  //   }
    // else {
      //   alert(`Signing up with Email: ${email}`);
      //   //Add sign-up logic here (e.g., API call)
      //   router.push("/Formulas"); //Redirect to Login page after sign up
    // }
  // };

  const onSignup = (data: FieldValues) => {
    signUp(data as SignupInput);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8 bg-gradient-to-br from-indigo-500 to-teal-500 text-white font-sans">
      <h1 className="text-4xl font-bold">Sign Up for Mini-Metrics</h1>
      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit(onSignup)}>
          <label className="block mb-2 text-sm font-medium">Username:</label>
          <input
            type="username"
            // value={username}
            // onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm mb-4 text-black"
            placeholder="Enter your username"
            {...register("username")}
          />
          <p>{errors.username?.message?.toString()}</p>
          <label className="block mb-2 text-sm font-medium">Email:</label>
          <input
            type="email"
            // value={email}
            // onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm mb-4 text-black"
            placeholder="Enter your email"
            {...register("email")}
          />
          <p>{errors.email?.message?.toString()}</p>
          <label className="block mb-2 text-sm font-medium">Password:</label>
          <input
            type="password"
            // value={password}
            // onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm mb-4 text-black"
            placeholder="Enter your password"
            {...register("password")}
          />
          <p>{errors.password?.message?.toString()}</p>
          <label className="block mb-2 text-sm font-medium">Confirm Password:</label>
          <input
            type="password"
            // value={confirmPassword}
            // onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm mb-4 text-black"
            placeholder="Confirm your password"
            {...register("confirmPassword")}
          />
          <p>{errors.confirmPassword?.message?.toString()}</p>
          <button
            type="submit"
            // onClick={handleSignUp}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-500 transition"
          >
            Sign Up
          </button>
          <div className="mt-4 text-center">
            <p className="text-sm">
              Already have an account?{" "}
              <button
                onClick={() => router.push("/Login")}
                className="text-blue-600 hover:underline"
              >
                Log In
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
