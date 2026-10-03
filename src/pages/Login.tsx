import { useForm } from "react-hook-form";
import { LoginSchema } from "../schemas/LoginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../store/authStore";

type LoginFormData = {
  email: string;
  password: string;
};

function Login() {
  const loginUser = useAuthStore((state) => state.login);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Login</h1>

      <form
        onSubmit={handleSubmit((data) => {
          const success = loginUser(data.email, data.password);
          console.log(success);
          
        })}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        {/* Email */}
        <div className="mb-4">
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
        <div className="mb-4">
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

        {/* Button */}
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded w-full"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
