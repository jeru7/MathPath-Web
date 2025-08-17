import { useState, type ReactElement } from "react";
import { NavLink, useParams } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { IoIosStats, IoIosDocument, IoMdSettings } from "react-icons/io";
import { PiStudent } from "react-icons/pi";
import { GrGroup } from "react-icons/gr";
import { useAuth } from "../../../auth/contexts/auth.context";
import { MdOutlineMenu } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { useTeacher } from "../../services/teacher.service";
import { capitalizeWord } from "../../../core/utils/string.util";

export default function Nav(): ReactElement {
  const { teacherId } = useParams();
  const { logout } = useAuth();
  const { data: teacher } = useTeacher(teacherId ?? "");

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

  const handleLogout = () => {
    if (teacherId) {
      logout(teacherId);
    }
  };

  return (
    <>
      <nav className="hidden w-18 fixed bottom-0 left-0 z-10 xl:flex h-screen flex-col items-center rounded-r-sm bg-[var(--tertiary-green)] py-4 text-white drop-shadow-md">
        <div className="flex flex-col items-center justify-between h-full">
          {/* nav items */}
          <div className="flex flex-col gap-4">
            {navItems.map(({ to, icon, defaultPage, title }, index) => {
              const isActive = defaultPage
                ? location.pathname === to
                : location.pathname.startsWith(to) &&
                  location.pathname !== `/teachers/${teacherId}`;
              return (
                <NavLink
                  key={index}
                  to={to}
                  className={`relative group rounded-full p-2 transition duration-200 ${isActive ? "bg-[var(--primary-green)]" : ""} `}
                  end={index === 0}
                >
                  {icon}
                  <div className="absolute opacity-0 group-hover:opacity-100 bg-[var(--primary-green)] px-2 py-1 rounded-sm top-1/2 -translate-y-1/2 left-full ml-4 whitespace-nowrap transition-opacity duration-200">
                    <p className="font-bold">{title}</p>
                  </div>
                </NavLink>
              );
            })}
          </div>

          {/* user profile */}
          <div className="flex flex-col gap-4">
            <div className="relative group p-2 rounded-full flex items-center justify-center hover:cursor-pointer">
              <IoMdSettings className="w-6 h-6" />
              <div className="absolute opacity-0 group-hover:opacity-200 bg-[var(--primary-green)] px-2 py-1 rounded-sm top-1/2 -translate-y-1/2 left-full ml-4 transition-opacity duration-200">
                <p className="font-bold">Settings</p>
              </div>
            </div>

            <button
              className="relative group p-2 rounded-full flex items-center justify-center hover:cursor-pointer"
              type="button"
              onClick={handleLogout}
            >
              <IoLogOut className="w-6 h-6" />
              <div className="absolute opacity-0 group-hover:opacity-200 bg-[var(--primary-green)] px-2 py-1 rounded-sm top-1/2 -translate-y-1/2 left-full ml-4 transition-opacity duration-200">
                <p className="font-bold">Logout</p>
              </div>
            </button>
            <div className="h-12 w-12 rounded-full hover:cursor-pointer relative group">
              {/* TODO: profile picture */}
              <div className="border-1 w-full h-full rounded-full"></div>
              <div className="absolute opacity-0 group-hover:opacity-200 bg-[var(--primary-green)] text-nowrap px-2 py-1 rounded-sm top-1/2 -translate-y-1/2 left-full ml-4 transition-opacity duration-200">
                <p className="font-bold">
                  {teacher?.lastName}, {capitalizeWord(teacher?.firstName)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* teacher mobile nav */}
      <nav
        className={`bg-[var(--tertiary-green)] xl:hidden fixed left-0 top-0 z-10 w-screen flex flex-col gap-8 ${
          isMenuOpen ? "h-screen" : "h-fit"
        }`}
      >
        {/* top section */}
        <div
          className={`flex justify-start gap-4 text-white w-full px-3 pt-3 ${isMenuOpen ? "pb-0" : "pb-3"}`}
        >
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
          <div className="flex flex-col flex-1 justify-between">
            {/* nav items */}
            <div className="flex flex-col gap-2 text-white px-3">
              {navItems.map(({ to, icon, defaultPage, title }, index) => {
                const isActive = defaultPage
                  ? location.pathname === to
                  : location.pathname.startsWith(to) &&
                    location.pathname !== `/teachers/${teacherId}`;
                return (
                  <NavLink
                    key={index}
                    to={to}
                    className={`${isMenuOpen ? "rounded-sm" : "rounded-full"} transition duration-200 ${isActive ? "bg-[var(--primary-green)]" : ""} `}
                    end={index === 0}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex gap-2 items-center px-4 py-2">
                      {icon}
                      <p className="text-lg font-semibold">{title}</p>
                    </div>
                  </NavLink>
                );
              })}
            </div>

            {/* botton section */}
            <section className="flex flex-col gap-2">
              <div className="flex flex-col gap-2 text-white px-3">
                {/* settings button */}
                <button className="flex items-center gap-2 px-4 py-2">
                  <IoMdSettings className="h-6 w-6" />
                  <p className="text-lg font-semibold">Settings</p>
                </button>

                {/* logout button */}
                <button
                  className="flex items-center gap-2 px-4 py-2"
                  type="button"
                  onClick={handleLogout}
                >
                  <IoLogOut className="h-6 w-6" />
                  <p className="text-lg font-semibold">Logout</p>
                </button>
              </div>

              {/* user profile */}
              <div className="flex bg-[var(--primary-green)]/50 p-3">
                <div className="flex gap-4">
                  <div className="border-1 h-12 w-12 rounded-full hover:scale-105 hover:cursor-pointer relative"></div>
                  <div>
                    <p className="font-bold text-white">
                      {teacher?.lastName}, {capitalizeWord(teacher?.firstName)}
                    </p>
                    <p className="text-sm text-gray-300">{teacher?.email}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}{" "}
      </nav>
    </>
  );
}
