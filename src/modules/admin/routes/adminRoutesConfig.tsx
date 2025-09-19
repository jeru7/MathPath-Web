import Admin from "../components/admin/Admin";
import Dashboard from "../components/dashboard/Dashboard";

export const adminRoutesConfig = [
  {
    path: "/admin/:adminId",
    element: <Admin />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "add-teacher", element: <Dashboard /> },
    ],
  },
];
