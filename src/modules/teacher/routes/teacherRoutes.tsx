import { Route } from "react-router-dom";
import Teacher from "../components/Teacher";
import Dashboard from "../pages/dashboard/DashboardPage";
import Students from "../pages/students/StudentsPage";
import Student from "../pages/students/student/StudentPage";
import Sections from "../pages/sections/SectionsPage";
import Assessments from "../pages/assessments/AssessmentsPage";
import Statistics from "../pages/statistics/StatisticsPage";
import CreateAssessment from "../pages/assessments/create/CreateAssessment";

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
