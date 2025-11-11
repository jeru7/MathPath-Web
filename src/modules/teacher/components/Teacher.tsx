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
      <div className="font-openSans pt-12 xl:pt-0 xl:pl-18 w-full min-h-screen h-fit bg-secondary text-[var(--primary-black)]">
        <Nav />
        <Outlet />
      </div>
    </TeacherProvider>
  );
}
