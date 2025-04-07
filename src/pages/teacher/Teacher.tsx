import { type ReactElement } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Nav from "./components/Nav";

export default function Teacher(): ReactElement {
  const location = useLocation();
  console.log("Current location:", location.pathname);

  return (
    <div className="font-openSans pl-18 h-screen bg-gray-200 text-[var(--primary-black)]">
      <Nav />
      <Outlet />
    </div>
  );
}
