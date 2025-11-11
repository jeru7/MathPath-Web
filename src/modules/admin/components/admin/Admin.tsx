import { type ReactElement } from "react";
import { useAuth } from "../../../auth/contexts/auth.context";
import AdminProvider from "../../context/AdminProvider";
import { Outlet } from "react-router-dom";
import Nav from "../Nav";

export default function Admin(): ReactElement {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading..</div>;
  }

  return (
    <AdminProvider adminId={user?.id}>
      <div className="font-openSans pt-12 xl:pt-0 xl:pl-18 w-full bg-secondary text-[var(--primary-black)]">
        <Nav />
        <Outlet />
      </div>
    </AdminProvider>
  );
}
