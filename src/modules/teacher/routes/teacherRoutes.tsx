import { Route } from "react-router-dom";
import Teacher from "../components/teacher/Teacher";
import TeacherDashboard from "../components/dashboard/TeacherDashboard";
import Students from "../components/students/Students";
import Student from "../components/students/components/Student";
import Sections from "../components/sections/Sections";
import Assessments from "../components/assessments/Assessments";
import CreateAssessment from "../components/assessments/components/CreateAssessment";

export const teacherRoutes = (
  <Route path="/teacher/:teacherId" element={<Teacher />}>
    <Route index element={<TeacherDashboard />} />
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
