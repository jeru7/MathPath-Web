import { type ReactElement } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useAuth } from "../../../auth/hooks/useAuth";
import { RxDashboard } from "react-icons/rx";
import { IoIosStats, IoIosDocument } from "react-icons/io";
import { PiStudent } from "react-icons/pi";
import { GrGroup } from "react-icons/gr";

export default function Nav(): ReactElement {
  const { teacherId } = useParams();
  const { logout } = useAuth();

  const navItems = [
    {
      to: `/teacher/${teacherId}`,
      icon: <RxDashboard className="h-8 w-8" />,
      defaultPage: true,
    },
    {
      to: `/teacher/${teacherId}/statistics`,
      icon: <IoIosStats className="h-8 w-8" />,
    },
    {
      to: `/teacher/${teacherId}/students`,
      icon: <PiStudent className="h-8 w-8" />,
    },
    {
      to: `/teacher/${teacherId}/sections`,
      icon: <GrGroup className="h-8 w-8" />,
    },
    {
      to: `/teacher/${teacherId}/assessments`,
      icon: <IoIosDocument className="h-8 w-8" />,
    },
  ];

  const handleLogoutClick = async () => {
    if (teacherId) {
      logout(teacherId);
    }
  };

  return (
    <nav className="w-18 fixed bottom-0 left-0 z-10 flex h-screen flex-col items-center rounded-r-sm bg-[var(--tertiary-green)] py-4 text-white drop-shadow-md">
      <div className="flex flex-col items-center justify-between h-full">
        {/* Nav Items */}
        <div className="flex flex-col gap-4">
          {navItems.map(({ to, icon, defaultPage }, index) => {
            const isActive = defaultPage
              ? location.pathname === to
              : location.pathname.startsWith(to) &&
                location.pathname !== `/teachers/${teacherId}`;
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
