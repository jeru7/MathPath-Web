import { type ReactElement } from "react";
import { Outlet, useParams } from "react-router-dom";
import Nav from "./components/Nav";
import { TeacherProvider } from "../../providers/TeacherProvider";

export default function Teacher(): ReactElement {
  const { teacherId } = useParams();
  console.log(teacherId)
  if (!teacherId) return <div>Missing teacher ID.</div>

  return (
    <TeacherProvider teacherId={teacherId}>
      <div className="font-openSans pl-18 h-screen bg-gray-200 text-[var(--primary-black)]">
        <Nav />
        <Outlet />
      </div>
    </TeacherProvider>
  );
}
