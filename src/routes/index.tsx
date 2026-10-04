import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../store/authStore";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const auth = useAuthStore.getState();
    const isValid = auth.validateSession();
    if (!isValid) {
      throw redirect({ to: "/login", replace: true });
    }
    throw redirect({ to: "/dashboard", replace: true });
  },
  component: () => null,
});

