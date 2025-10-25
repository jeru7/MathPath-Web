import { useState, type ReactElement } from "react";
import { RxDashboard } from "react-icons/rx";
import { useAdminContext } from "../context/admin.context";
import { NavLink, useNavigate } from "react-router-dom";
import { IoIosStats, IoMdSettings } from "react-icons/io";
import { IoClose, IoLogOut } from "react-icons/io5";
import { capitalizeWord } from "../../core/utils/string.util";
import { MdOutlineMenu } from "react-icons/md";
import { useAuth } from "../../auth/contexts/auth.context";
import { getProfilePicture } from "../../core/utils/profile-picture.util";
import { FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";

export default function Nav(): ReactElement {
  const { adminId, admin } = useAdminContext();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);

  const navItems = [
    {
      to: `/admin/${adminId}`,
      icon: <RxDashboard className={"h-4 w-4 sm:h-6 sm:w-6 min-h-4 min-w-4"} />,
      title: "Dashboard",
      defaultPage: true,
    },
    {
      to: `/admin/${adminId}/statistics`,
      icon: <IoIosStats className={"h-4 w-4 sm:h-6 sm:w-6 min-h-4 min-w-4"} />,
      title: "Statistics",
      defaultPage: false,
    },
    {
      to: `/admin/${adminId}/teachers`,
      icon: (
        <FaChalkboardTeacher
          className={"h-4 w-4 sm:h-6 sm:w-6 min-h-4 min-w-4"}
        />
      ),
      title: "Teachers",
      defaultPage: false,
    },
    {
      to: `/admin/${adminId}/students`,
      icon: (
        <FaUserGraduate className={"h-4 w-4 sm:h-6 sm:w-6 min-h-4 min-w-4"} />
      ),
      title: "Students",
      defaultPage: false,
    },
  ];

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = async () => {
    if (adminId) {
      logout(adminId);
    }
    setShowLogoutConfirm(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      {/* desktop nav */}
      <nav className="hidden w-18 fixed bottom-0 left-0 z-10 xl:flex h-screen flex-col items-center rounded-r-sm bg-[var(--tertiary-green)] dark:bg-gray-800 py-4 text-white dark:text-gray-100 drop-shadow-md transition-colors duration-200">
        <div className="flex flex-col items-center justify-between h-full">
          {/* nav items */}
          <div className="flex flex-col gap-4">
            {navItems.map(({ to, icon, defaultPage, title }, index) => {
              const isActive = defaultPage
                ? location.pathname === to
                : location.pathname.startsWith(to) &&
                location.pathname !== `/admin/${adminId}`;
              return (
                <NavLink
                  key={index}
                  to={to}
                  className={`relative group rounded-full p-2 transition duration-200 ${isActive ? "bg-[var(--primary-green)] dark:bg-green-700" : "hover:bg-[var(--primary-green)]/80 dark:hover:bg-green-700/80"} `}
                  end={index === 0}
                >
                  {icon}
                  <div className="pointer-events-none absolute opacity-0 group-hover:opacity-100 bg-[var(--primary-green)] dark:bg-green-700 px-2 py-1 rounded-sm top-1/2 -translate-y-1/2 left-full ml-4 whitespace-nowrap transition-opacity duration-200">
                    <p className="font-bold dark:text-white">{title}</p>
                  </div>
                </NavLink>
              );
            })}
          </div>

          {/* user profile */}
          <div className="flex flex-col gap-4">
            <button
              className="relative group p-2 rounded-full flex items-center justify-center hover:cursor-pointer hover:bg-[var(--primary-green)]/80 dark:hover:bg-green-700/80 transition duration-200"
              type="button"
              onClick={() => {
                navigate(`/admin/${adminId}/settings`);
              }}
            >
              <IoMdSettings className="w-6 h-6" />
              <div className="pointer-events-none absolute opacity-0 group-hover:opacity-100 bg-[var(--primary-green)] dark:bg-green-700 px-2 py-1 rounded-sm top-1/2 -translate-y-1/2 left-full ml-4 transition-opacity duration-200">
                <p className="font-bold dark:text-white">Settings</p>
              </div>
            </button>

            <button
              className="relative group p-2 rounded-full flex items-center justify-center hover:cursor-pointer hover:bg-[var(--primary-green)]/80 dark:hover:bg-green-700/80 transition duration-200"
              type="button"
              onClick={handleLogoutClick}
            >
              <IoLogOut className="w-6 h-6" />
              <div className="pointer-events-none absolute opacity-0 group-hover:opacity-100 bg-[var(--primary-green)] dark:bg-green-700 px-2 py-1 rounded-sm top-1/2 -translate-y-1/2 left-full ml-4 transition-opacity duration-200">
                <p className="font-bold dark:text-white">Logout</p>
              </div>
            </button>

            <button
              className="h-12 w-12 rounded-full hover:cursor-pointer relative group hover:bg-[var(--primary-green)]/80 dark:hover:bg-green-700/80 transition duration-200"
              type="button"
              onClick={() => {
                navigate(`/admin/${adminId}/profile`);
              }}
            >
              <div className="border-1 border-gray-300 dark:border-gray-600 h-12 w-12 rounded-full hover:scale-105 hover:cursor-pointer relative overflow-hidden transition-transform duration-200">
                <img
                  src={getProfilePicture(admin?.profilePicture ?? "Default")}
                  alt="Profile picture"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="pointer-events-none absolute opacity-0 group-hover:opacity-100 bg-[var(--primary-green)] dark:bg-green-700 text-nowrap px-2 py-1 rounded-sm top-1/2 -translate-y-1/2 left-full ml-4 transition-opacity duration-200">
                <p className="font-bold dark:text-white">
                  {admin?.lastName}, {capitalizeWord(admin?.firstName)}
                </p>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* mobile nav */}
      <div className="xl:hidden">
        {/* top bar */}
        <nav className="bg-[var(--tertiary-green)] dark:bg-gray-800 flex gap-4 fixed left-0 top-0 z-20 w-full h-12 items-center px-3 transition-colors duration-200">
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="text-white dark:text-gray-100"
          >
            <MdOutlineMenu className="h-6 w-6" />
          </button>
          <h1 className="font-bold font-baloo text-xl text-white dark:text-gray-100">
            MathPath
          </h1>
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
          className={`fixed flex flex-col gap-4 top-0 left-0 z-40 h-full w-2/4 min-w-62 max-w-sm rounded-r-sm bg-[var(--tertiary-green)] dark:bg-gray-800 transform ease-in-out xl:hidden transition-colors duration-200 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--primary-green)]/30 dark:border-green-700/30">
            <h2 className="text-white dark:text-gray-100 font-bold text-lg font-baloo">
              MathPath
            </h2>
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              className="text-white dark:text-gray-100 hover:bg-[var(--primary-green)]/50 dark:hover:bg-green-700/50 rounded-full p-2 transition duration-200"
            >
              <IoClose />
            </button>
          </div>

          <div className="flex flex-col flex-1">
            {/* nav items */}
            <div className="flex-1 flex flex-col gap-2 text-white dark:text-gray-100 px-4">
              {navItems.map(({ to, icon, defaultPage, title }, index) => {
                const isActive = defaultPage
                  ? location.pathname === to
                  : location.pathname.startsWith(to) &&
                  location.pathname !== `/admin/${adminId}`;
                return (
                  <NavLink
                    key={index}
                    to={to}
                    className={`rounded-sm transition duration-200 ${isActive ? "bg-[var(--primary-green)] dark:bg-green-700" : "hover:bg-[var(--primary-green)]/50 dark:hover:bg-green-700/50"} `}
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
              <div className="flex flex-col gap-2 text-white dark:text-gray-100 px-4">
                {/* settings button */}
                <button
                  className="flex items-center gap-3 px-4 py-3 rounded-sm hover:bg-[var(--primary-green)]/50 dark:hover:bg-green-700/50 transition duration-200"
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate(`/admin/${adminId}/settings`);
                  }}
                >
                  <IoMdSettings className="h-4 w-4 sm:h-6 sm:w-6" />
                  <p className="text-sm sm:text-base font-semibold">Settings</p>
                </button>

                {/* logout button */}
                <button
                  className="flex items-center gap-3 px-4 py-3 rounded-sm hover:bg-[var(--primary-green)]/50 dark:hover:bg-green-700/50 transition duration-200"
                  type="button"
                  onClick={handleLogoutClick}
                >
                  <IoLogOut className="h-4 w-4 sm:h-6 sm:w-6" />
                  <p className="text-sm sm:text-base font-semibold">Logout</p>
                </button>
              </div>

              {/* user profile */}
              <button
                className="bg-[var(--primary-green)]/30 dark:bg-green-700/30 mx-4 p-4 rounded-sm"
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate(`/admin/${adminId}/profile`);
                }}
              >
                <div className="flex gap-3 items-center">
                  <div className="border border-gray-300 dark:border-gray-600 h-8 w-8 sm:h-12 sm:w-12 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={getProfilePicture(
                        admin?.profilePicture ?? "Default",
                      )}
                      alt="Profile picture"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-sm sm:text-base font-bold text-white dark:text-gray-100 truncate">
                      {admin?.lastName}, {capitalizeWord(admin?.firstName)}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-200 dark:text-gray-300 truncate">
                      {admin?.email}
                    </p>
                  </div>
                </div>
              </button>
            </section>
          </div>
        </nav>
      </div>

      {/* logout modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-sm max-w-md w-full p-6 shadow-xl transition-colors duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <IoLogOut className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Confirm Logout
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to logout from your account?
              </p>

              {/* buttons */}
              <div className="flex gap-3 w-full">
                <button
                  type="button"
                  onClick={handleLogoutCancel}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-sm hover:cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLogoutConfirm}
                  className="flex-1 px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-sm hover:cursor-pointer hover:bg-red-700 dark:hover:bg-red-800 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
