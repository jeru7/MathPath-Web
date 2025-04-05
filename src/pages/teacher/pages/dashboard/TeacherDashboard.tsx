import { type ReactElement } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

export default function TeacherDashboard(): ReactElement {
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
    <div className="font-plexMono h-screen max-h-screen bg-gray-200 pl-16 text-[var(--primary-black)]">
      <main className="h-full w-full border-2 bg-inherit"></main>
      {/* <button onClick={handleLogout}>Logout</button> */}
    </div>
  );
}
