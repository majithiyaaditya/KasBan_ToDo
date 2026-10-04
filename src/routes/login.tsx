import { createFileRoute, redirect } from "@tanstack/react-router";
import Login from "../pages/Login";
import { useAuthStore } from "../store/authStore";

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    const auth = useAuthStore.getState();
    const isValid = auth.validateSession();
    if (isValid) {
      throw redirect({ to: "/dashboard", replace: true });
    }
  },
  component: Login,
});

