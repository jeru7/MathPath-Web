import { type ReactElement } from "react";
import { Outlet } from "react-router-dom";
import Nav from "./components/Nav";

export default function Teacher(): ReactElement {
  return (
    <div className="font-plexMono h-screen bg-gray-200 pl-16 text-[var(--primary-black)]">
      <Nav />
      <Outlet />
    </div>
  );
}
