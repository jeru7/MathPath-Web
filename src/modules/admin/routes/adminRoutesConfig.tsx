import Admin from "../components/admin/Admin";
import Dashboard from "../pages/dashboard/Dashboard";
import Profile from "../pages/profile/Profile";
import Sections from "../pages/sections/Sections";
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
      {
        path: "teachers",
        children: [
          { index: true, element: <Teachers /> },
          { path: "add-teacher", element: <Teachers /> },
          { path: ":teacherId", element: <Teachers /> },
        ],
      },
      {
        path: "students",
        children: [
          { index: true, element: <Students /> },
          { path: "add-student", element: <Students /> },
        ],
      },
      { path: "profile", element: <Profile /> },
      { path: "settings", element: <AdminSettings /> },
      { path: "statistics", element: <Statistics /> },
      {
        path: "sections",
        children: [
          { index: true, element: <Sections /> },
          { path: "add-section", element: <Sections /> },
        ],
      },
    ],
  },
];
