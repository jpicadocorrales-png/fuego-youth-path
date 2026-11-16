import { createFileRoute, Outlet } from "@tanstack/react-router";

// Versión demo: sin inicio de sesión. Se renderiza solo en el cliente porque el
// progreso del visitante se guarda en localStorage.
export const Route = createFileRoute("/_app")({
  ssr: false,
  component: () => <Outlet />,
});
