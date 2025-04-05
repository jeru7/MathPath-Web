import { Outlet } from "react-router-dom";
import useAuthCheck from "../hooks/useAuthCheck";

export default function PrivateRoute() {
  const authStatus = useAuthCheck();

  if (authStatus === null) {
    return <div>Loading...</div>;
  }

  return <>{authStatus && <Outlet />}</>;
}
