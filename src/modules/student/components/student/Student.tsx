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
      <div className="font-openSans pt-12 xl:pt-0 xl:pl-18 w-full min-h-screen h-fit bg-inherit text-[var(--primary-black)]">
        <Nav />
        <Outlet />
      </div>
    </StudentProvider>
  );
}
