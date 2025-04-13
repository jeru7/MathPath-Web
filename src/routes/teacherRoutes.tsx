import { Route } from "react-router-dom";
import Teacher from "../pages/teacher/Teacher";
import Dashboard from "../pages/teacher/components/dashboard/Dashboard";
import Students from "../pages/teacher/components/students/Students";
import Sections from "../pages/teacher/components/sections/Sections";
import Assessments from "../pages/teacher/components/assessments/Assessments";

export const teacherRoutes = (
  <Route path="/teachers/:teacherId" element={<Teacher />}>
    <Route index element={<Dashboard />} />
    <Route path="students">
      <Route index element={<Students />} />
      <Route path="add-students" element={<Students />} />
    </Route>
    <Route path="sections" element={<Sections />} />
    <Route path="assessments" element={<Assessments />} />
  </Route>
);
