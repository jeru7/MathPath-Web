import { Navigate, Outlet } from "react-router-dom";
import useAuthCheck from "../hooks/useAuthCheck";
import { UserAuth } from "../types/user";

export default function PrivateRoute() {
  const auth: UserAuth = useAuthCheck();

  if (auth.isLoggedIn === null) {
    return <div>Loading...</div>;
  }

  if (!auth.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (auth?.userId) {
    if (
      auth?.role === "teacher" &&
      !window.location.pathname.includes("/teachers/")
    ) {
      return <Navigate to={`/teachers/${auth?.userId}`} replace />;
    }
    if (
      auth?.role === "student" &&
      !window.location.pathname.includes("/students/")
    ) {
      return <Navigate to={`/students/${auth?.userId}`} replace />;
    }
  }

  return <Outlet />;
}
