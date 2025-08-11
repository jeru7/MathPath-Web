import Student from "../components/student/Student";
import Assessments from "../components/assessment/Assessments";
import StudentAnalytics from "../components/analytics/StudentAnalytics";
import StudentDashboard from "../components/dashboard/StudentDashboard";

export const studentRoutesConfig = [
  {
    path: "/student/:studentId",
    element: <Student />,
    children: [
      { index: true, element: <StudentDashboard /> },
      { path: "analytics", element: <StudentAnalytics /> },
      { path: "assessments", element: <Assessments /> },
    ],
  },
];
