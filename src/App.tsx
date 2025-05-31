import "./index.css";
import { Routes, Route } from "react-router-dom";

import Landing from "./pages/landing/Landing";
import Login from "./pages/login/Login";

import PrivateRoute from "./routes/PrivateRoutes";
import { AuthProvider } from "./providers/AuthProvider";

import { teacherRoutes } from "./routes/teacherRoutes";
import { studentRoutes } from "./routes/studentRoutes";

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
