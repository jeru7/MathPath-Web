import { useState, type ReactElement } from "react";
import { NavLink } from "react-router-dom";
import { IoIosDocument, IoIosStats, IoMdSettings } from "react-icons/io";
import { RxDashboard } from "react-icons/rx";
import { useAuth } from "../../../auth/contexts/auth.context";
import { useStudentContext } from "../../contexts/student.context";
import { IoClose, IoLogOut } from "react-icons/io5";
import { capitalizeWord } from "../../../core/utils/string.util";
import { MdOutlineMenu } from "react-icons/md";
import { getProfilePicture } from "../../../core/utils/profile-picture.util";

export default function Nav(): ReactElement {
  const { studentId, student } = useStudentContext();
  const { logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const navItems = [
    {
      to: `/student/${studentId}`,
      icon: <RxDashboard className={"h-4 w-4 sm:h-6 sm:w-6 min-h-4 min-w-4"} />,
      title: "Dashboard",
      defaultPage: true,
    },
    {
      to: `/student/${studentId}/statistics`,
      icon: <IoIosStats className={"h-4 w-4 sm:h-6 sm:w-6 min-h-4 min-w-4"} />,
      title: "Statistics",
    },
    {
      to: `/student/${studentId}/assessments`,
      icon: (
        <IoIosDocument className={"h-4 w-4 sm:h-6 sm:w-6 min-h-4 min-w-4"} />
      ),
      title: "Assessments",
    },
  ];

  const handleLogout = async () => {
    if (studentId) {
      logout(studentId);
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
                  location.pathname !== `/students/${studentId}`;
              return (
                <NavLink
                  key={index}
                  to={to}
                  className={`relative group rounded-full p-2 transition duration-200 ${isActive ? "bg-[var(--primary-green)]" : ""} `}
                  end={index === 0}
                >
                  {icon}
                  <div className="pointer-events-none absolute opacity-0 group-hover:opacity-100 bg-[var(--primary-green)] px-2 py-1 rounded-sm top-1/2 -translate-y-1/2 left-full ml-4 whitespace-nowrap transition-opacity duration-200">
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
              <div className="pointer-events-none absolute opacity-0 group-hover:opacity-200 bg-[var(--primary-green)] px-2 py-1 rounded-sm top-1/2 -translate-y-1/2 left-full ml-4 transition-opacity duration-200">
                <p className="font-bold">Settings</p>
              </div>
            </div>

            <button
              className="relative group p-2 rounded-full flex items-center justify-center hover:cursor-pointer"
              type="button"
              onClick={handleLogout}
            >
              <IoLogOut className="w-6 h-6" />
              <div className="pointer-events-none absolute opacity-0 group-hover:opacity-200 bg-[var(--primary-green)] px-2 py-1 rounded-sm top-1/2 -translate-y-1/2 left-full ml-4 transition-opacity duration-200">
                <p className="font-bold">Logout</p>
              </div>
            </button>
            <div className="h-12 w-12 rounded-full hover:cursor-pointer relative group">
              <div className="border-1 border-gray-300 h-12 w-12 rounded-full hover:scale-105 hover:cursor-pointer relative overflow-hidden">
                <img
                  src={getProfilePicture(student?.profilePicture ?? "Default")}
                  alt="Profile picture"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="pointer-events-none absolute opacity-0 group-hover:opacity-200 bg-[var(--primary-green)] text-nowrap px-2 py-1 rounded-sm top-1/2 -translate-y-1/2 left-full ml-4 transition-opacity duration-200">
                <p className="font-bold">
                  {student?.lastName}, {capitalizeWord(student?.firstName)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* mobile */}
      <div className="xl:hidden">
        {/* top bar */}
        <nav className="bg-[var(--tertiary-green)] flex gap-4 fixed left-0 top-0 z-20 w-full h-12 items-center px-3">
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="text-white"
          >
            <MdOutlineMenu className="h-6 w-6" />
          </button>
          <h1 className="font-bold font-baloo text-xl text-white">MathPath</h1>
        </nav>

        {/* overlay */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 xl:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* sliding menu */}
        <nav
          className={`fixed flex flex-col gap-4 top-0 left-0 z-40 h-full w-2/4 min-w-62 max-w-sm rounded-r-sm bg-[var(--tertiary-green)] transform transition-transform duration-300 ease-in-out xl:hidden ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--primary-green)]/30">
            <h2 className="text-white font-bold text-lg font-baloo">
              MathPath
            </h2>
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              className="text-white hover:bg-[var(--primary-green)]/50 rounded-full p-2 transition duration-200"
            >
              <IoClose />
            </button>
          </div>

          <div className="flex flex-col flex-1">
            {/* nav items */}
            <div className="flex-1 flex flex-col gap-2 text-white px-4">
              {navItems.map(({ to, icon, defaultPage, title }, index) => {
                const isActive = defaultPage
                  ? location.pathname === to
                  : location.pathname.startsWith(to) &&
                    location.pathname !== `/students/${studentId}`;
                return (
                  <NavLink
                    key={index}
                    to={to}
                    className={`rounded-sm transition duration-200 ${isActive ? "bg-[var(--primary-green)]" : "hover:bg-[var(--primary-green)]/50"} `}
                    end={index === 0}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex gap-2 items-center px-4 py-3">
                      {icon}
                      <p className="text-sm sm:text-base font-semibold">
                        {title}
                      </p>
                    </div>
                  </NavLink>
                );
              })}
            </div>

            {/* bottom section */}
            <section className="flex flex-col gap-2 pb-6">
              <div className="flex flex-col gap-2 text-white px-4">
                {/* settings button */}
                <button className="flex items-center gap-3 px-4 py-3 rounded-sm hover:bg-[var(--primary-green)]/50 transition duration-200">
                  <IoMdSettings className="h-4 w-4 sm:h-6 sm:w-6" />
                  <p className="text-sm sm:text-base font-semibold">Settings</p>
                </button>

                {/* logout button */}
                <button
                  className="flex items-center gap-3 px-4 py-3 rounded-sm hover:bg-[var(--primary-green)]/50 transition duration-200"
                  type="button"
                  onClick={handleLogout}
                >
                  <IoLogOut className="h-4 w-4 sm:h-6 sm:w-6" />
                  <p className="text-sm sm:text-base font-semibold">Logout</p>
                </button>
              </div>

              {/* user profile */}
              <div className="bg-[var(--primary-green)]/30 mx-4 p-4 rounded-sm">
                <div className="flex gap-3 items-center">
                  <div className="border border-gray-300 h-8 w-8 sm:h-12 sm:w-12 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={getProfilePicture(
                        student?.profilePicture ?? "Default",
                      )}
                      alt="Profile picture"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm sm:text-base font-bold text-white truncate">
                      {student?.lastName}, {capitalizeWord(student?.firstName)}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-200 truncate">
                      {student?.email}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </nav>
      </div>
    </>
  );
}
