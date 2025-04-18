import { type ReactElement } from "react";

import { NavLink, useParams } from "react-router-dom";

import { User, Users, FileText, LayoutDashboard } from "lucide-react";

export default function Nav(): ReactElement {
  const { teacherId } = useParams();

  const navItems = [
    {
      to: `/teachers/${teacherId}`,
      icon: <LayoutDashboard className="h-8 w-8" />,
      defaultPage: true,
    },
    {
      to: `/teachers/${teacherId}/students`,
      icon: <User className="h-8 w-8" />,
    },
    {
      to: `/teachers/${teacherId}/sections`,
      icon: <Users className="h-8 w-8" />,
    },
    {
      to: `/teachers/${teacherId}/assessments`,
      icon: <FileText className="h-8 w-8" />,
    },
  ];

  return (
    <nav className="w-18 fixed bottom-0 left-0 z-10 flex h-screen flex-col items-center justify-between rounded-r-sm bg-[var(--tertiary-green)] py-4 text-white drop-shadow-md">
      {/* Nav Items */}
      <div className="flex flex-col gap-4">
        {navItems.map(({ to, icon, defaultPage }, index) => {
          const isActive = defaultPage
            ? location.pathname === to
            : location.pathname.startsWith(to) && location.pathname !== `/teachers/${teacherId}`;
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
      <div className="border-1 h-12 w-12 rounded-full"></div>
    </nav>
  );
}
