import Admin from "../components/admin/Admin";
import Dashboard from "../components/dashboard/Dashboard";
import Profile from "../pages/profile/Profile";
import AdminSettings from "../pages/settings/AdminSettings";
import Statistics from "../pages/statistics/Statistics";
import Students from "../pages/students/Students";
import Teachers from "../pages/teachers/Teachers";

export const adminRoutesConfig = [
  {
    path: "/admin/:adminId",
    element: <Admin />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "add-teacher", element: <Dashboard /> },
      { path: "teachers", element: <Teachers /> },
      { path: "students", element: <Students /> },
      { path: "profile", element: <Profile /> },
      { path: "settings", element: <AdminSettings /> },
      { path: "statistics", element: <Statistics /> },
    ],
  },
];
