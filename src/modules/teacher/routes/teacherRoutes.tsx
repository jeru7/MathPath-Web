import { Route } from "react-router-dom";
import Teacher from "../pages/teacher/Teacher";
import Overview from "../pages/teacher/pages/overview/Overview";
import Students from "../pages/teacher/pages/students/Students";
import Sections from "../pages/teacher/pages/sections/Sections";
import Assessments from "../pages/teacher/pages/assessments/Assessments";
import Student from "../pages/teacher/pages/students/Students";
import CreateAssessment from "../pages/teacher/pages/assessments/components/CreateAssessment";

export const teacherRoutes = (
  <Route path="/teacher/:teacherId" element={<Teacher />}>
    <Route index element={<Overview />} />
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
