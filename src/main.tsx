import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./modules/auth/contexts/AuthProvider";
import PrivateRoute from "./modules/core/routes/PrivateRoutes";
import Landing from "./modules/landing/components/Landing";
import Login from "./modules/core/components/login/Login";
import "./index.css";
import { teacherRoutesConfig } from "./modules/teacher/routes/teacherRoutesConfig";
import { studentRoutesConfig } from "./modules/student/routes/studentRoutesConfig";
import App from "./App";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: (
      <AuthProvider>
        <ToastContainer position="bottom-right" theme="colored" />
        <App />
      </AuthProvider>
    ),
    children: [
      // public routes
      { path: "/", element: <Landing /> },
      { path: "/login", element: <Login /> },

      // private routes
      {
        element: <PrivateRoute />,
        children: [...teacherRoutesConfig, ...studentRoutesConfig],
      },

      // Catch-all
      { path: "*", element: <Landing /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);

