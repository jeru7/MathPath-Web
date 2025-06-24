import "./index.css";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./modules/auth/providers/AuthProvider";
import Landing from "./modules/landing/components/Landing";
import Login from "./modules/core/components/login/Login";
import PrivateRoute from "./modules/core/routes/PrivateRoutes";
import { teacherRoutes } from "./modules/teacher/routes/teacherRoutes";
import { studentRoutes } from "./modules/student/routes/studentRoutes";

function App() {
  return (
    <div className="flex flex-col items-center bg-gray-100">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element=<Login /> />

          <Route element={<PrivateRoute />}>
            {teacherRoutes}
            {studentRoutes}
          </Route>

          <Route path="*" element={<Landing />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
