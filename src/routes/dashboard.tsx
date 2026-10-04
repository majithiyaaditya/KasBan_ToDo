import { createFileRoute, redirect } from "@tanstack/react-router";
import Dashboard from "../pages/Dashboard";
import { useAuthStore } from "../store/authStore";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    const auth = useAuthStore.getState();
    const isValid = auth.validateSession();
    if (!isValid) {
      throw redirect({
        to: "/login",
        replace: true,
      });
    }
  },
  component: Dashboard,
});

