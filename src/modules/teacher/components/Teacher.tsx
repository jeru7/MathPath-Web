import { type ReactElement } from "react";
import { Outlet } from "react-router-dom";
import Nav from "./nav/Nav";
import { useAuth } from "../../auth/contexts/auth.context";
import { TeacherProvider } from "../context/TeacherProvider";

export default function Teacher(): ReactElement {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading..</div>;
  }

  return (
    <TeacherProvider teacherId={user?.id}>
      <div className="font-openSans pl-18 h-screen w-full max-w-[2000px] bg-inherit text-[var(--primary-black)]">
        <Nav />
        <Outlet />
      </div>
    </TeacherProvider>
  );
}
