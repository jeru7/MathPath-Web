import "./index.css";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className="flex flex-col font-primary items-center h-fit min-h-screen">
      <Outlet />
    </div>
  );
}
