import { useState } from "react";
import { useForm } from "react-hook-form";
import { LoginSchema } from "../schemas/LoginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "@tanstack/react-router";
import { Layers, AlertCircle, ArrowRight, Lock, Mail } from "lucide-react";

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
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  return (
    <div className="min-h-screen bg-[#F5F2EA] text-[#18262B] relative flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Ambient Liquid Blobs */}
      <div className="liquid-orb liquid-orb-ocean -top-24 -left-24" />
      <div className="liquid-orb liquid-orb-copper -bottom-24 -right-24" />
      <div className="liquid-orb liquid-orb-light top-1/3 left-1/3" />

      {/* Brand Header */}
      <div className="relative z-10 flex flex-col items-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[#FFFCF6] border border-[#D7D2C7] flex items-center justify-center text-[#B9683E] shadow-sm mb-3">
          <Layers className="w-7 h-7 text-[#B9683E]" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#18262B]">
          KasBan
        </h1>
        <p className="text-xs sm:text-sm text-[#617278] mt-1.5 uppercase tracking-widest font-bold">
          Project Command Center
        </p>
      </div>

      {/* Form Surface */}
      <div className="relative z-10 w-full max-w-md bg-[#FFFCF6]/85 backdrop-blur-xl border border-[#D7D2C7] rounded-2xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(23,59,74,0.10)] glass-panel">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#18262B]">Sign in to your account</h2>
          <p className="text-sm text-[#617278] mt-1.5">
            Access your workspace boards, tasks, and project analytics.
          </p>
        </div>

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
          className="space-y-4.5"
        >
          {authError && (
            <div className="p-3.5 bg-[#C94B4B]/5 border border-[#C94B4B]/30 text-[#C94B4B] rounded-xl text-sm flex items-center gap-2.5 font-medium">
              <AlertCircle className="w-4 h-4 text-[#C94B4B] shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-[#617278] mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#617278] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                className={`w-full bg-[#FFFCF6] border ${
                  errors.email ? "border-[#C94B4B] bg-[#C94B4B]/5" : "border-[#D7D2C7] focus:border-[#B9683E] focus:ring-1 focus:ring-[#B9683E]/20"
                } rounded-xl pl-10 pr-3.5 py-3 text-sm sm:text-base text-[#18262B] placeholder-[#617278]/60 transition outline-none`}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-xs sm:text-sm text-[#C94B4B] mt-1.5 font-medium flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.email.message}</span>
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-[#617278] mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#617278] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className={`w-full bg-[#FFFCF6] border ${
                  errors.password ? "border-[#C94B4B] bg-[#C94B4B]/5" : "border-[#D7D2C7] focus:border-[#B9683E] focus:ring-1 focus:ring-[#B9683E]/20"
                } rounded-xl pl-10 pr-3.5 py-3 text-sm sm:text-base text-[#18262B] placeholder-[#617278]/60 transition outline-none`}
                {...register("password")}
              />
            </div>
            {errors.password && (
              <p className="text-xs sm:text-sm text-[#C94B4B] mt-1.5 font-medium flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.password.message}</span>
              </p>
            )}
          </div>

          {/* Primary Action Button (Copper Primary) */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#B9683E] hover:bg-[#98502F] text-[#FFFCF6] font-bold text-base py-3 px-4 rounded-xl transition duration-200 cursor-pointer shadow-[0_8px_20px_rgba(185,104,62,0.20)] flex items-center justify-center gap-2 active:translate-y-0 disabled:opacity-60"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#D7D2C7] text-center">
          <p className="text-sm text-[#617278]">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#B9683E] font-bold hover:underline transition"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
