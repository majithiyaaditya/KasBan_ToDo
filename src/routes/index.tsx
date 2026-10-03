import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuthStore } from "../store/authStore";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

function IndexComponent() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}
