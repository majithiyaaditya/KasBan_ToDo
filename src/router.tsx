import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

import Register from "./pages/Ragister";
import Login from "./pages/Login";

const rootRoute = createRootRoute();

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: Register,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});

const routeTree = rootRoute.addChildren([
  registerRoute,
  loginRoute,
]);

export const router = createRouter({
  routeTree,
});