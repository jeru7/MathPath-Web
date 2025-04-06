import { Route } from "react-router-dom";
import Teacher from "../pages/teacher/Teacher";
import DashboardPage from "../pages/teacher/components/dashboard/DashboardPage";
import StudentPage from "../pages/teacher/components/students/StudentPage";
import SectionPage from "../pages/teacher/components/sections/SectionPage";
import AssessmentPage from "../pages/teacher/components/assessments/AssessmentPage";

export const teacherRoutes = (
  <Route path="/teachers/:teacherId" element={<Teacher />}>
    <Route index element={<DashboardPage />} />
    <Route path="students" element={<StudentPage />} />
    <Route path="sections" element={<SectionPage />} />
    <Route path="assessments" element={<AssessmentPage />} />
  </Route>
);
