import { type ReactElement } from "react";
import { Outlet, useParams } from "react-router-dom";
import Nav from "./components/Nav";
import { TeacherContextProvider } from "../../context/TeacherContext";

export default function Teacher(): ReactElement {
  const { teacherId } = useParams();
  if (!teacherId) return <div>Missing teacher ID.</div>

  return (
    <TeacherContextProvider teacherId={teacherId}>
      <div className="font-openSans pl-18 h-screen bg-gray-200 text-[var(--primary-black)]">
        <Nav />
        <Outlet />
      </div>
    </TeacherContextProvider>
  );
}
