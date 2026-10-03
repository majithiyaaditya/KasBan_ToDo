import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schemas/registerSchema";
import { useAuthStore } from "../store/authStore";

type RegisterFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function Register() {
  const registerUser = useAuthStore((state) => state.register);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold p-5">Register</h1>

      <form
        onSubmit={handleSubmit((data) => {
          const success = registerUser(
            data.username,
            data.email,
            data.password,
          );
          console.log(success);
        })}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        {/* Username */}
        <div>
          <label htmlFor="username">Username</label>

          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            className="border p-2 w-full rounded"
            {...register("username")}
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="border p-2 w-full rounded"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="border p-2 w-full rounded"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div >
          <label htmlFor="confirmPassword">Confirm Password</label>

          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            className="border p-2 w-full rounded"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="border p-2 w-full rounded">
          Create Account
        </button>
      </form>
    </div>
  );
}

export default Register;
