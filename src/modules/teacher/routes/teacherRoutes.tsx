import { Route } from "react-router-dom";
import Teacher from "../components/Teacher";
import Dashboard from "../pages/dashboard/Dashboard";
import Students from "../pages/students/Students";
import Student from "../pages/students/student/Student";
import Sections from "../pages/sections/Sections";
import Assessments from "../pages/assessments/Assessments";
import Statistics from "../pages/statistics/Statistics";
import AssessmentBuilder from "../pages/assessments/builder/";

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
      <Route path="create" element={<AssessmentBuilder />} />
    </Route>
  </Route>
);
