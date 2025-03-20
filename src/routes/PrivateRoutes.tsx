import { Navigate, Outlet } from "react-router-dom";

interface PrivateRouteProps {
  role: "teacher" | "student";
}

export default function PrivateRoute({ role }: PrivateRouteProps) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;
  if (userRole !== role) return <Navigate to="/login" replace />;

  return <Outlet />;
}
