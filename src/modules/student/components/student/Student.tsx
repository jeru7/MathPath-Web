import { type ReactElement } from "react";
import { Outlet } from "react-router-dom";
import Nav from "../nav/Nav";
import { useAuth } from "../../../auth/contexts/auth.context";
import { StudentProvider } from "../../contexts/StudentProvider";

export default function Student(): ReactElement {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-primary border-gray-200 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <StudentProvider studentId={user?.id}>
      <div className="font-openSans pt-12 xl:pt-0 xl:pl-18 w-full min-h-screen h-fit">
        <Nav />
        <Outlet />
      </div>
    </StudentProvider>
  );
}
