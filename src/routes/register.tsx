import { createFileRoute } from "@tanstack/react-router";
import Register from "../pages/Ragister";

export const Route = createFileRoute("/register")({
  component: Register,
});
