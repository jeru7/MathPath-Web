import { Route } from "react-router-dom";

import Student from "../pages/student/Student";
import Dashboard from "../pages/student/components/dashboard/Dashboard";
import Assessments from "../pages/student/components/assessment/Assessments";
import Home from "../pages/student/components/home/Home";

export const studentRoutes = (
  <Route path="/student/:studentId" element={<Student />}>
    <Route index element={<Home />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="assessments" element={<Assessments />} />
  </Route>
);
