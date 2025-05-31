import { type ReactElement } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { StudentProvider } from "../../providers/StudentProvider";
import Nav from "./components/Nav";

export default function Student(): ReactElement {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading..</div>;
  }

  return (
    <StudentProvider studentId={user?._id}>
      <div className="font-openSans min-h-screen overflow-y-auto h-screen gap-2 w-full bg-inherit text-[var(--primary-black)] pl-16">
        <Nav />
        <Outlet />
      </div>
    </StudentProvider>
  );
}
