import "./index.css";
import { Routes, Route } from "react-router-dom";

import Landing from "./pages/landing/Landing";
import Login from "./pages/login/Login";
import { teacherRoutes } from "./routes/teacherRoutes";
import StudentDashboard from "./pages/student/pages/dashboard/StudentDashboard";
import PrivateRoute from "./utils/PrivateRoutes";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element=<Login /> />

      <Route element={<PrivateRoute />}>
        {teacherRoutes}
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
