import { useState, type ReactElement } from "react";
import { NavLink, useParams } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { IoIosStats, IoIosDocument } from "react-icons/io";
import { PiStudent } from "react-icons/pi";
import { GrGroup } from "react-icons/gr";
import { useAuth } from "../../../auth/contexts/auth.context";
import { MdOutlineMenu } from "react-icons/md";

export default function Nav(): ReactElement {
  const { teacherId } = useParams();
  const { logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const navItems = [
    {
      to: `/teacher/${teacherId}`,
      icon: <RxDashboard className={`${isMenuOpen ? "h-6 w-6" : "h-8 w-8"}`} />,
      title: "Dashboard",
      defaultPage: true,
    },
    {
      to: `/teacher/${teacherId}/statistics`,
      icon: <IoIosStats className={`${isMenuOpen ? "h-6 w-6" : "h-8 w-8"}`} />,
      title: "Statistics",
    },
    {
      to: `/teacher/${teacherId}/students`,
      icon: <PiStudent className={`${isMenuOpen ? "h-6 w-6" : "h-8 w-8"}`} />,
      title: "Students",
    },
    {
      to: `/teacher/${teacherId}/sections`,
      icon: <GrGroup className={`${isMenuOpen ? "h-6 w-6" : "h-8 w-8"}`} />,
      title: "Sections",
    },
    {
      to: `/teacher/${teacherId}/assessments`,
      icon: (
        <IoIosDocument className={`${isMenuOpen ? "h-6 w-6" : "h-8 w-8"}`} />
      ),
      title: "Assessments",
    },
  ];

  const handleLogoutClick = async () => {
    if (teacherId) {
      logout(teacherId);
    }
  };

  return (
    <>
      <nav className="hidden w-18 fixed bottom-0 left-0 z-10 xl:flex h-screen flex-col items-center rounded-r-sm bg-[var(--tertiary-green)] py-4 text-white drop-shadow-md">
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

      {/* teacher mobile nav */}
      <nav
        className={`bg-[var(--tertiary-green)] xl:hidden fixed left-0 top-0 z-10 w-screen flex flex-col gap-8 p-3 ${
          isMenuOpen ? "h-screen" : "h-fit"
        }`}
      >
        <div className="flex justify-start gap-4 text-white w-full">
          <button
            className=""
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <MdOutlineMenu className="h-6 w-6" />
          </button>
          <h1 className="font-bold font-baloo text-2xl">MathPath</h1>
        </div>
        {isMenuOpen && (
          <div className="flex flex-col gap-8">
            {/* nav items */}
            <div className="flex flex-col gap-2 text-white">
              {navItems.map(({ to, icon, defaultPage, title }, index) => {
                const isActive = defaultPage
                  ? location.pathname === to
                  : location.pathname.startsWith(to) &&
                    location.pathname !== `/teachers/${teacherId}`;
                return (
                  <NavLink
                    key={index}
                    to={to}
                    className={`colors ${isMenuOpen ? "rounded-sm" : "rounded-full"}  p-2 transition duration-200 ${isActive ? "bg-[var(--primary-green)]" : ""} `}
                    end={index === 0}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex gap-2 items-center px-4">
                      <div>{icon}</div>
                      <p className="text-lg font-semibold">{title}</p>
                    </div>
                  </NavLink>
                );
              })}
            </div>

            {/* user profile */}
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
        )}{" "}
      </nav>
    </>
  );
}
