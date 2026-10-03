import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schemas/registerSchema";
import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "@tanstack/react-router";

type RegisterFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function Register() {
  const [authError, setAuthError] = useState<string | null>(null);
  const registerUser = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">Create an Account</h1>

      <form
        onSubmit={handleSubmit((data) => {
          setAuthError(null);
          const success = registerUser(
            data.username,
            data.email,
            data.password,
          );
          if (success) {
            navigate({ to: "/login" });
          } else {
            setAuthError("An account with this email already exists.");
          }
        })}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        {authError && (
          <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-600 rounded text-sm">
            {authError}
          </div>
        )}

        {/* Username */}
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-black"
            {...register("username")}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
          )}
        </div>

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

        {/* Confirm Password */}
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-black"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded w-full transition cursor-pointer"
        >
          Create Account
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
