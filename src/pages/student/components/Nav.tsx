import { type ReactElement } from "react";
import { NavLink, useParams } from "react-router-dom";

// icons
import { FileText, LayoutDashboard, House } from "lucide-react";

import { useAuth } from "../../../hooks/useAuth";

export default function Nav(): ReactElement {
  const { studentId } = useParams();
  const { logout } = useAuth();

  const navItems = [
    {
      to: `/student/${studentId}`,
      icon: <House className="h-8 w-8" />,
      defaultPage: true,
    },
    {
      to: `/student/${studentId}/dashboard`,
      icon: <LayoutDashboard className="h-8 w-8" />,
      defaultPage: true,
    },
    {
      to: `/student/${studentId}/assessments`,
      icon: <FileText className="h-8 w-8" />,
    },
  ];

  const handleLogoutClick = async () => {
    if (studentId) {
      logout(studentId);
    }
  };

  return (
    <nav className="w-fit px-2 flex h-screen flex-col items-end rounded-r-sm bg-[var(--tertiary-green)] py-4 text-white drop-shadow-md">
      <div className="flex flex-col items-center justify-between h-full">
        {/* Nav Items */}
        <div className="flex flex-col gap-4">
          {navItems.map(({ to, icon, defaultPage }, index) => {
            const isActive = defaultPage
              ? location.pathname === to
              : location.pathname.startsWith(to) &&
                location.pathname !== `/students/${studentId}`;
            return (
              <NavLink
                key={index}
                to={to}
                className={`colors rounded-full p-2 transition duration-200 ${isActive ? "bg-[var(--primary-green)]" : ""} `}
                end={index === 0}
              >
                {icon}
              </NavLink>
            );
          })}
        </div>

        {/* User Profile */}
        <div className="relative group">
          <div className="border-1 h-12 w-12 rounded-full hover:scale-105 hover:cursor-pointer relative"></div>

          <button
            className="absolute top-1/2 left-full ml-2 -translate-y-1/2 bg-red-400 rounded-sm px-4 hover:cursor-pointer py-1 hover:bg-red-500 opacity-0 group-hover:opacity-100 transition"
            onClick={handleLogoutClick}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
