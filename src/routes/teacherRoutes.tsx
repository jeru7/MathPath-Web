import { Route } from "react-router-dom";
import Teacher from "../pages/teacher/Teacher";
import Dashboard from "../pages/teacher/components/dashboard/Dashboard";
import Students from "../pages/teacher/components/students/Students";
import Sections from "../pages/teacher/components/sections/Sections";
import Assessments from "../pages/teacher/components/assessments/Assessments";
import Student from "../pages/teacher/components/students/Student";
import CreateAssessment from "../pages/teacher/components/assessments/CreateAssessment";

export const teacherRoutes = (
  <Route path="/teacher/:teacherId" element={<Teacher />}>
    <Route index element={<Dashboard />} />
    <Route path="students">
      <Route index element={<Students />} />
      <Route path="add-students" element={<Students />} />
      <Route path=":studentId" element={<Student />} />
    </Route>
    <Route path="sections" element={<Sections />} />
    <Route path="assessments">
      <Route index element={<Assessments />} />
      <Route path="create" element={<CreateAssessment />} />
    </Route>
  </Route>
);
