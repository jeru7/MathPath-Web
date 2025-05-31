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
    !window.location.pathname.includes("/teacher/")
  ) {
    return <Navigate to={`/teacher/${user._id}`} replace />;
  }
  if (
    user.role === "student" &&
    !window.location.pathname.includes("/student/")
  ) {
    return <Navigate to={`/student/${user._id}`} replace />;
  }

  return <Outlet />;
}
