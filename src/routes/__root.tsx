import { createRootRoute, Outlet } from "@tanstack/react-router";
import { AmbientCursorGlow } from "../components/interactions/AmbientCursorGlow";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <AmbientCursorGlow />
      <Outlet />
    </>
  );
}
