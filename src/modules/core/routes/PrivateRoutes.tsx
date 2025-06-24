import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";

export default function PrivateRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user === null) {
    return <Navigate to="/login" replace />;
  }

  if (
    user.role === "Teacher" &&
    !window.location.pathname.includes("/teacher/")
  ) {
    return <Navigate to={`/teacher/${user.id}`} replace />;
  }
  if (
    user.role === "Student" &&
    !window.location.pathname.includes("/student/")
  ) {
    return <Navigate to={`/student/${user.id}`} replace />;
  }

  return <Outlet />;
}
