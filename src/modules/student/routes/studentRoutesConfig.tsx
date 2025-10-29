import { PreviewProvider } from "../../core/contexts/preview/PreviewProvider";
import Student from "../components/student/Student";
import Assessments from "../pages/assessments/Assessments";
import AnswerAssessment from "../pages/assessments/components/answer/AnswerAssessment";
import Dashboard from "../pages/dashboard/Dashboard";
import Profile from "../pages/profile/Profile";
import StudentSettings from "../pages/settings/StudentSettings";
import Statistics from "../pages/statistics/Statistics";

export const studentRoutesConfig = [
  {
    path: "/student/:studentId",
    element: <Student />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "statistics", element: <Statistics /> },
      {
        path: "assessments",
        children: [
          { index: true, element: <Assessments /> },
          {
            path: ":assessmentId/attempt",
            element: (
              <PreviewProvider>
                <AnswerAssessment />
              </PreviewProvider>
            ),
          },
        ],
      },
      { path: "profile", element: <Profile /> },
      { path: "settings", element: <StudentSettings /> },
    ],
  },
];
