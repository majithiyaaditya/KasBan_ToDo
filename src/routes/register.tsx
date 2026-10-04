import { createFileRoute, redirect } from "@tanstack/react-router";
import Register from "../pages/Ragister";
import { useAuthStore } from "../store/authStore";

export const Route = createFileRoute("/register")({
  beforeLoad: () => {
    const auth = useAuthStore.getState();
    const isValid = auth.validateSession();
    if (isValid) {
      throw redirect({ to: "/dashboard", replace: true });
    }
  },
  component: Register,
});

