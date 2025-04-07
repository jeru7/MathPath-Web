import { Navigate, Outlet } from "react-router-dom";
import useAuthCheck from "../hooks/useAuthCheck";

export default function PrivateRoute() {
  const { status, userData } = useAuthCheck();

  if (status === null) {
    return <div>Loading...</div>;
  }

  if (!status) {
    return <Navigate to="/login" replace />;
  }

  if (userData) {
    if (
      userData.role === "teacher" &&
      !window.location.pathname.includes("/teachers/")
    ) {
      return <Navigate to={`/teachers/${userData.userId}`} replace />;
    }
    if (
      userData.role === "student" &&
      !window.location.pathname.includes("/students/")
    ) {
      return <Navigate to={`/students/${userData.userId}`} replace />;
    }
  }

  return <Outlet />;
}
