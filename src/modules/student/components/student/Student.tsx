import { type ReactElement } from "react";
import { Outlet } from "react-router-dom";
import Nav from "../nav/Nav";
import { useAuth } from "../../../auth/contexts/auth.context";
import { StudentProvider } from "../../contexts/StudentProvider";

export default function Student(): ReactElement {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading..</div>;
  }

  return (
    <StudentProvider studentId={user?.id}>
      <div className="font-openSans min-h-screen overflow-y-auto h-screen gap-2 w-full bg-inherit text-[var(--primary-black)] pl-16">
        <Nav />
        <Outlet />
      </div>
    </StudentProvider>
  );
}
