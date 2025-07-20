import { Route } from "react-router-dom";
import Student from "../components/student/Student";
import Assessments from "../components/assessment/Assessments";
import StudentAnalytics from "../components/analytics/StudentAnalytics";
import StudentDashboard from "../components/dashboard/StudentDashboard";

export const StudentRoutes = (
  <Route path="/student/:studentId" element={<Student />}>
    <Route index element={<StudentDashboard />} />
    <Route path="analytics" element={<StudentAnalytics />} />
    <Route path="assessments" element={<Assessments />} />
  </Route>
);
