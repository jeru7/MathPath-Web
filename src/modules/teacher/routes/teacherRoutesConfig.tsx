import Teacher from "../components/Teacher";
import Dashboard from "../pages/dashboard/Dashboard";
import Students from "../pages/students/Students";
import Sections from "../pages/sections/Sections";
import Assessments from "../pages/assessments/Assessments";
import Statistics from "../pages/statistics/Statistics";
import AssessmentBuilderWrapper from "../pages/assessments/builder/AssessmentBuilderWrapper";
import Profile from "../pages/profile/Profile";
import TeacherSettings from "../pages/settings/TeacherSettings";
import Requests from "../pages/requests/Requests";

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
          { path: "edit-students", element: <Students /> },
          { path: "registration-codes", element: <Students /> },
        ],
      },
      { path: "statistics", element: <Statistics /> },
      {
        path: "sections",
        children: [
          { index: true, element: <Sections /> },
          { path: "add-section", element: <Sections /> },
        ],
      },
      {
        path: "assessments",
        children: [
          { index: true, element: <Assessments /> },
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
      { path: "requests", element: <Requests /> },
      { path: "profile", element: <Profile /> },
      { path: "settings", element: <TeacherSettings /> },
    ],
  },
];
