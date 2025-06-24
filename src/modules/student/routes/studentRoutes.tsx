import { Route } from "react-router-dom";
import Student from "../components/student/Student";
import Home from "../components/overview/Overview";
import Dashboard from "../components/stats/Dashboard";
import Assessments from "../components/assessment/Assessments";

export const studentRoutes = (
  <Route path="/student/:studentId" element={<Student />}>
    <Route index element={<Home />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="assessments" element={<Assessments />} />
  </Route>
);
