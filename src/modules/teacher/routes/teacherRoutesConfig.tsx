import Teacher from "../components/Teacher";
import Dashboard from "../pages/dashboard/Dashboard";
import Students from "../pages/students/Students";
import Student from "../pages/students/student/Student";
import Sections from "../pages/sections/Sections";
import Assessments from "../pages/assessments/Assessments";
import Statistics from "../pages/statistics/Statistics";
import AssessmentBuilderWrapper from "../pages/assessments/builder/AssessmentBuilderWrapper";
import AssessmentInfo from "../pages/assessments/info/AssessmentInfo";

export const teacherRoutesConfig = [
  {
    path: "/teacher/:teacherId",
    element: <Teacher />,
    children: [
      { index: true, element: <Dashboard /> },
      {
        path: "students",
        children: [
          { index: true, element: <Students /> },
          { path: "add-students", element: <Students /> },
          { path: ":studentId", element: <Student /> },
        ],
      },
      { path: "statistics", element: <Statistics /> },
      { path: "sections", element: <Sections /> },
      {
        path: "assessments",
        children: [
          { index: true, element: <Assessments /> },
          { path: ":assessmentId", element: <AssessmentInfo /> },
          { path: "new", element: <AssessmentBuilderWrapper /> },
          {
            path: ":assessmentId/create",
            element: <AssessmentBuilderWrapper />,
          },
          {
            path: ":assessmentId/configure",
            element: <AssessmentBuilderWrapper />,
          },
          {
            path: ":assessmentId/publish",
            element: <AssessmentBuilderWrapper />,
          },
        ],
      },
    ],
  },
];
