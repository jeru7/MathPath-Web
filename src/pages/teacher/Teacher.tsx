import { type ReactElement } from "react";
import { Outlet } from "react-router-dom";
import Nav from "./components/Nav";
import { TeacherProvider } from "../../providers/TeacherProvider";
import { useAuth } from "../../hooks/useAuth";

export default function Teacher(): ReactElement {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading..</div>
  }

  return (
    <TeacherProvider teacherId={user?._id}>
      <div className="font-openSans pl-18 h-screen w-full max-w-[2000px] bg-gray-200 text-[var(--primary-black)]">
        <Nav />
        <Outlet />
      </div>
    </TeacherProvider>
  );
}
