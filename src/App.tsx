import "./index.css";
import { AuthProvider } from "./modules/auth/contexts/AuthProvider";
import { Routes, Route } from "react-router-dom";
import Landing from "./modules/landing/components/Landing";
import Login from "./modules/core/components/login/Login";
import PrivateRoute from "./modules/core/routes/PrivateRoutes";
import { TeacherRoutes } from "./modules/teacher/routes/TeacherRoutes";
import { StudentRoutes } from "./modules/student/routes/StudentRoutes";

function App() {
  return (
    <div className="flex flex-col font-primary items-center bg-gray-100 h-fit">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element=<Login /> />

          <Route element={<PrivateRoute />}>
            {TeacherRoutes}
            {StudentRoutes}
          </Route>

          <Route path="*" element={<Landing />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
