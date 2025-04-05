import { type ReactElement } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

export default function StudentDashboard(): ReactElement {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
       await axios.post(
        "/api/web/auth/logout",
        {},
        { withCredentials: true },
      );

      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold">Student Dashboard</h1>
      <button
        onClick={handleLogout}
        className="mt-4 rounded-md bg-red-500 p-2 text-white"
      >
        Logout
      </button>
    </div>
  );
}
