import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schemas/registerSchema";
import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "@tanstack/react-router";
import { Layers, AlertCircle, ArrowRight, Lock, Mail, User } from "lucide-react";
import { MagneticButton } from "../components/interactions";
import { AnimatedItem } from "../components/AnimatedList";
import { AuthPageBackground } from "../components/auth";

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
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <div className="min-h-screen bg-[#F5F2EA] text-[#18262B] relative flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden selection:bg-[#B9683E] selection:text-[#FFFCF6]">
      {/* Dynamic Animated Gradient and Liquid Background */}
      <AuthPageBackground />

      {/* Brand Header */}
      <AnimatedItem index={0} delay={0.04} duration={0.65} scale={0.92} y={16}>
        <div className="relative z-10 flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#FFFCF6] border border-[#D7D2C7] flex items-center justify-center text-[#B9683E] shadow-sm mb-3">
            <Layers className="w-6 h-6 text-[#B9683E]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18262B]">
            KasBan
          </h1>
          <p className="text-xs text-[#617278] mt-1 uppercase tracking-widest font-semibold">
            Create Workspace Account
          </p>
        </div>
      </AnimatedItem>

      {/* Form Surface */}
      <AnimatedItem index={1} delay={0.12} duration={0.65} scale={0.95} y={16} className="w-full max-w-md">
        <div className="relative z-10 w-full bg-[#FFFCF6]/85 backdrop-blur-xl border border-[#D7D2C7] rounded-2xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(23,59,74,0.10)] glass-panel">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#18262B]">Get started with KasBan</h2>
            <p className="text-xs text-[#617278] mt-1">
              Organize tasks, monitor stages, and accelerate your productivity.
            </p>
          </div>

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
              className="space-y-4"
            >
              {authError && (
                <div className="p-3 bg-[#C94B4B]/5 border border-[#C94B4B]/30 text-[#C94B4B] rounded-xl text-xs flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 text-[#C94B4B] shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#617278] mb-1.5"
                >
                  Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#617278] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="username"
                    type="text"
                    placeholder="johndoe"
                    className={`w-full bg-[#FFFCF6]/90 border ${
                      errors.username ? "border-[#C94B4B] bg-[#C94B4B]/5" : "border-[#D7D2C7] focus:border-[#B9683E] focus:ring-1 focus:ring-[#B9683E]/20"
                    } rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#18262B] placeholder-[#617278]/60 transition outline-none`}
                    {...register("username")}
                  />
                </div>
                {errors.username && (
                  <p className="text-xs text-[#C94B4B] mt-1.5 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.username.message}</span>
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#617278] mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#617278] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className={`w-full bg-[#FFFCF6]/90 border ${
                      errors.email ? "border-[#C94B4B] bg-[#C94B4B]/5" : "border-[#D7D2C7] focus:border-[#B9683E] focus:ring-1 focus:ring-[#B9683E]/20"
                    } rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#18262B] placeholder-[#617278]/60 transition outline-none`}
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-[#C94B4B] mt-1.5 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.email.message}</span>
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#617278] mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#617278] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className={`w-full bg-[#FFFCF6]/90 border ${
                      errors.password ? "border-[#C94B4B] bg-[#C94B4B]/5" : "border-[#D7D2C7] focus:border-[#B9683E] focus:ring-1 focus:ring-[#B9683E]/20"
                    } rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#18262B] placeholder-[#617278]/60 transition outline-none`}
                    {...register("password")}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-[#C94B4B] mt-1.5 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.password.message}</span>
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#617278] mb-1.5"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#617278] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className={`w-full bg-[#FFFCF6]/90 border ${
                      errors.confirmPassword ? "border-[#C94B4B] bg-[#C94B4B]/5" : "border-[#D7D2C7] focus:border-[#B9683E] focus:ring-1 focus:ring-[#B9683E]/20"
                    } rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#18262B] placeholder-[#617278]/60 transition outline-none`}
                    {...register("confirmPassword")}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-[#C94B4B] mt-1.5 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.confirmPassword.message}</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <MagneticButton
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#B9683E] hover:bg-[#98502F] text-[#FFFCF6] font-semibold py-2.5 px-4 rounded-xl transition duration-200 cursor-pointer shadow-[0_8px_20px_rgba(185,104,62,0.20)] flex items-center justify-center gap-2 active:translate-y-0 disabled:opacity-60"
                strength={0.25}
              >
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </MagneticButton>
            </form>

          <div className="mt-6 pt-5 border-t border-[#D7D2C7] text-center">
            <p className="text-xs text-[#617278]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#B9683E] font-semibold hover:underline transition"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </AnimatedItem>
    </div>
  );
}

export default Register;

