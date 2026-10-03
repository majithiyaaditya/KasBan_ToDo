import { useState } from "react";
import { useForm } from "react-hook-form";
import { LoginSchema } from "../schemas/LoginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "@tanstack/react-router";

type LoginFormData = {
  email: string;
  password: string;
};

function Login() {
  const [authError, setAuthError] = useState<string | null>(null);
  const loginUser = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">Login</h1>

      <form
        onSubmit={handleSubmit((data) => {
          setAuthError(null);
          const success = loginUser(data.email, data.password);
          if (success) {
            navigate({ to: "/dashboard" });
          } else {
            setAuthError("Invalid email or password. Please try again.");
          }
        })}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        {authError && (
          <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-600 rounded text-sm">
            {authError}
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-black"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-black"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Button */}
        <button
          type="submit"
          className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded w-full transition cursor-pointer"
        >
          Login
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
