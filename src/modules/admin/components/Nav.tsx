import { useState, type ReactElement } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { IoIosDocument, IoIosStats, IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { MdOutlineMenu } from "react-icons/md";
import { FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
import { GrGroup } from "react-icons/gr";
import { useAdminContext } from "../context/admin.context";
import { useAuth } from "../../auth/contexts/auth.context";
import { capitalizeWord } from "../../core/utils/string.util";
import { getProfilePicture } from "../../core/utils/profile-picture.util";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export default function Nav(): ReactElement {
  const { adminId, admin } = useAdminContext();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);

  const navItems = [
    {
      to: `/admin/${adminId}`,
      icon: <RxDashboard className="h-5 w-5" />,
      title: "Dashboard",
      defaultPage: true,
    },
    {
      to: `/admin/${adminId}/statistics`,
      icon: <IoIosStats className="h-5 w-5" />,
      title: "Statistics",
      defaultPage: false,
    },
    {
      to: `/admin/${adminId}/teachers`,
      icon: <FaChalkboardTeacher className="h-5 w-5" />,
      title: "Teachers",
      defaultPage: false,
    },
    {
      to: `/admin/${adminId}/students`,
      icon: <FaUserGraduate className="h-5 w-5" />,
      title: "Students",
      defaultPage: false,
    },
    {
      to: `/admin/${adminId}/sections`,
      icon: <GrGroup className="h-5 w-5" />,
      title: "Sections",
      defaultPage: false,
    },
    {
      to: `/admin/${adminId}/assessments`,
      icon: <IoIosDocument className="h-5 w-5" />,
      title: "Assessments",
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
      {/* desktop navigation */}
      <nav className="hidden w-18 fixed bottom-0 left-0 z-10 xl:flex h-screen flex-col items-center py-6 bg-background border-r border-border">
        <div className="flex flex-col items-center justify-between h-full w-full">
          <div className="flex flex-col gap-3 w-full px-2">
            {navItems.map(({ to, icon, defaultPage, title }, index) => {
              const isActive = defaultPage
                ? location.pathname === to
                : location.pathname.startsWith(to) &&
                location.pathname !== `/admin/${adminId}`;
              return (
                <NavLink
                  key={index}
                  to={to}
                  className={`relative group flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 ${isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  end={index === 0}
                >
                  <div className="flex items-center justify-center">{icon}</div>
                  <div className="pointer-events-none absolute opacity-0 group-hover:opacity-100 bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm font-medium top-1/2 -translate-y-1/2 left-full ml-3 whitespace-nowrap transition-opacity duration-200 z-50 shadow-lg">
                    {title}
                    <div className="absolute w-2 h-2 bg-primary rotate-45 -left-1 top-1/2 -translate-y-1/2" />
                  </div>
                </NavLink>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 w-full px-2">
            {/* settings button */}
            <div className="relative group">
              <button
                onClick={() => navigate(`/admin/${adminId}/settings`)}
                className="flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <IoMdSettings className="h-5 w-5" />
              </button>
              <div className="pointer-events-none absolute opacity-0 group-hover:opacity-100 bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm font-medium top-1/2 -translate-y-1/2 left-full ml-3 whitespace-nowrap transition-opacity duration-200 z-50 shadow-lg">
                Settings
                <div className="absolute w-2 h-2 bg-primary rotate-45 -left-1 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* logout button */}
            <div className="relative group">
              <button
                onClick={handleLogoutClick}
                className="flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <IoLogOut className="h-5 w-5" />
              </button>
              <div className="pointer-events-none absolute opacity-0 group-hover:opacity-100 bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm font-medium top-1/2 -translate-y-1/2 left-full ml-3 whitespace-nowrap transition-opacity duration-200 z-50 shadow-lg">
                Logout
                <div className="absolute w-2 h-2 bg-primary rotate-45 -left-1 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* profile button */}
            <div className="relative group">
              <button
                onClick={() => navigate(`/admin/${adminId}/profile`)}
                className="flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 text-muted-foreground hover:bg-accent hover:text-accent-foreground p-0"
              >
                <Avatar className="h-8 w-8 border-2 border-transparent group-hover:border-primary/20 transition-colors">
                  <AvatarImage
                    src={getProfilePicture(admin?.profilePicture ?? "Default")}
                    alt="Profile picture"
                  />
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {admin?.firstName?.[0]}
                    {admin?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </button>
              <div className="pointer-events-none absolute opacity-0 group-hover:opacity-100 bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm font-medium top-1/2 -translate-y-1/2 left-full ml-3 whitespace-nowrap transition-opacity duration-200 z-50 shadow-lg min-w-32">
                <p className="font-semibold">
                  {admin?.lastName}, {capitalizeWord(admin?.firstName)}
                </p>
                <div className="absolute w-2 h-2 bg-primary rotate-45 -left-1 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* mobile navigation */}
      <div className="xl:hidden">
        <nav className="bg-background border-b border-border flex items-center fixed left-0 top-0 z-20 w-full h-16 px-4 shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="mr-3"
          >
            <MdOutlineMenu className="h-5 w-5 text-foreground" />
          </Button>
          <h1 className="font-bold font-baloo text-xl text-primary">
            MathPath
          </h1>
        </nav>

        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetContent
            side="left"
            className="w-80 p-0 bg-background border-r border-border"
          >
            <SheetHeader className="px-6 h-14 flex flex-row items-center border-b border-border">
              <SheetTitle className="text-primary font-bold text-lg font-baloo">
                MathPath
              </SheetTitle>
            </SheetHeader>

            <div className="flex flex-col h-[calc(100vh-56px)]">
              <div className="flex-1 flex flex-col gap-1 p-4">
                {navItems.map(({ to, icon, defaultPage, title }, index) => {
                  const isActive = defaultPage
                    ? location.pathname === to
                    : location.pathname.startsWith(to) &&
                    location.pathname !== `/admin/${adminId}`;
                  return (
                    <NavLink
                      key={index}
                      to={to}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
                      end={index === 0}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center justify-center w-5 h-5">
                        {icon}
                      </div>
                      <p className="text-sm font-medium">{title}</p>
                    </NavLink>
                  );
                })}

                {/* settings */}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate(`/admin/${adminId}/settings`);
                  }}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <IoMdSettings className="h-5 w-5" />
                  <span className="text-sm font-medium">Settings</span>
                </button>

                {/* logout */}
                <button
                  onClick={handleLogoutClick}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <IoLogOut className="h-5 w-5" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>

              <div className="p-4 border-t border-border">
                <Card className="bg-muted/50 border-border">
                  <CardContent className="p-4">
                    <button
                      className="w-full p-0 h-auto hover:bg-transparent text-left"
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate(`/admin/${adminId}/profile`);
                      }}
                    >
                      <div className="flex gap-3 items-center w-full">
                        <Avatar className="h-10 w-10 border border-border">
                          <AvatarImage
                            src={getProfilePicture(
                              admin?.profilePicture ?? "Default",
                            )}
                            alt="Profile picture"
                          />
                          <AvatarFallback className="bg-muted text-muted-foreground">
                            {admin?.firstName?.[0]}
                            {admin?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {admin?.lastName},{" "}
                            {capitalizeWord(admin?.firstName)}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {admin?.email}
                          </p>
                        </div>
                      </div>
                    </button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* logout confirmation dialog */}
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                <IoLogOut className="w-6 h-6 text-destructive" />
              </div>
              <div className="space-y-2">
                <DialogTitle className="text-lg font-semibold">
                  Confirm Logout
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Are you sure you want to logout from your account?
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={handleLogoutCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogoutConfirm}
              className="flex-1"
            >
              Logout
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
