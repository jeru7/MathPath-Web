import "./index.css";
import { Routes, Route } from "react-router-dom";

import Landing from "./pages/landing/Landing";
import Login from "./pages/login/Login";
import TeacherDashboard from "./pages/teacher/pages/dashboard/TeacherDashboard";
import StudentDashboard from "./pages/student/pages/dashboard/StudentDashboard";
import PrivateRoute from "./utils/PrivateRoutes";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element=<Login /> />

      <Route element={<PrivateRoute />}>
        <Route
          path="/teachers/:teacherId/dashboard"
          element={<TeacherDashboard />}
        />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route
          path="/students/:studentId/dashboard"
          element={<StudentDashboard />}
        />
      </Route>

      <Route path="*" element={<Landing />} />
    </Routes>
  );
}

export default App;
