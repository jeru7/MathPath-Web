import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../auth/contexts/auth.context";

export default function PrivateRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user === null) {
    return <Navigate to="/auth/login" replace />;
  }

  if (
    user.role === "teacher" &&
    !window.location.pathname.includes("/teacher/")
  ) {
    return <Navigate to={`/teacher/${user.id}`} replace />;
  }
  if (
    user.role === "student" &&
    !window.location.pathname.includes("/student/")
  ) {
    return <Navigate to={`/student/${user.id}`} replace />;
  }
  if (user.role === "admin" && !window.location.pathname.includes("/admin/")) {
    return <Navigate to={`/admin/${user.id}`} replace />;
  }

  return <Outlet />;
}
