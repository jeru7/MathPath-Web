import { Route } from "react-router-dom";
import Teacher from "../components/Teacher";
import Dashboard from "../pages/dashboard_page/DashboardPage";
import Students from "../pages/students_page/StudentsPage";
import Student from "../pages/students_page/student_page/Student";
import Sections from "../pages/sections_page/SectionsPage";
import Assessments from "../pages/assessments_page/AssessmentsPage";
import Statistics from "../pages/statistics_page/StatisticsPage";
import CreateAssessment from "../pages/assessments_page/components/create_assessment/CreateAssessment";

export const teacherRoutes = (
  <Route path="/teacher/:teacherId" element={<Teacher />}>
    <Route index element={<Dashboard />} />
    <Route path="students">
      <Route index element={<Students />} />
      <Route path="add-students" element={<Students />} />
      <Route path=":studentId" element={<Student />} />
    </Route>
    <Route path="statistics" element={<Statistics />} />
    <Route path="sections" element={<Sections />} />
    <Route path="assessments">
      <Route index element={<Assessments />} />
      <Route path="create" element={<CreateAssessment />} />
    </Route>
  </Route>
);
