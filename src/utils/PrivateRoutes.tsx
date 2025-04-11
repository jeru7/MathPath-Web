import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PrivateRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user === null) {
    return <Navigate to="/login" replace />;
  }

  if (
    user.role === "teacher" &&
    !window.location.pathname.includes("/teachers/")
  ) {
    return <Navigate to={`/teachers/${user._id}`} replace />;
  }
  if (
    user.role === "student" &&
    !window.location.pathname.includes("/students/")
  ) {
    return <Navigate to={`/students/${user._id}`} replace />;
  }

  return <Outlet />;
}
