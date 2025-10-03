import Student from "../components/student/Student";
import Assessments from "../pages/assessments/Assessments";
import Dashboard from "../pages/dashboard/Dashboard";
import Statistics from "../pages/statistics/Statistics";

export const studentRoutesConfig = [
  {
    path: "/student/:studentId",
    element: <Student />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "statistics", element: <Statistics /> },
      { path: "assessments", element: <Assessments /> },
    ],
  },
];
