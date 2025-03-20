import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/landing/Landing";
import Login from "./pages/login/Login";
import TeacherDashboard from "./pages/teacher/pages/dashboard/TeacherDashboard";
import StudentDashboard from "./pages/student/pages/dashboard/StudentDashboard";
import PrivateRoute from "./routes/PrivateRoutes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element=<Login /> />
        <Route element={<PrivateRoute role="teacher" />}>
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        </Route>

        <Route element={<PrivateRoute role="student" />}>
          <Route path="/student-dashboard" element={<StudentDashboard />} />
        </Route>

        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
