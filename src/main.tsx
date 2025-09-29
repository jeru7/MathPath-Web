import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./modules/auth/contexts/AuthProvider";
import PrivateRoute from "./modules/core/routes/PrivateRoutes";
import Landing from "./modules/landing/components/Landing";
import "./index.css";
import { teacherRoutesConfig } from "./modules/teacher/routes/teacherRoutesConfig";
import { studentRoutesConfig } from "./modules/student/routes/studentRoutesConfig";
import App from "./App";
import Auth from "./modules/core/components/auth/Auth";
import LoginForm from "./modules/core/components/auth/login/LoginForm";
import RequestCode from "./modules/core/components/auth/forgot-password/RequestCode";
import VerifyCode from "./modules/core/components/auth/forgot-password/VerifyCode";
import SetNewPassword from "./modules/core/components/auth/forgot-password/SetNewPassword";
import RegisterForm from "./modules/core/components/auth/register/RegisterForm";
import { adminRoutesConfig } from "./modules/admin/routes/adminRoutesConfig";
import AdminLoginForm from "./modules/core/components/auth/admin/AdminLoginForm";
import VerifyEmailPage from "./modules/core/components/auth/email-verification/VerifyEmailPage";
import { queryClient } from "./modules/core/hooks/queryClient";

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

      // auth routes
      // login - teacher/student
      {
        path: "/auth/login",
        element: (
          <Auth>
            <LoginForm />
          </Auth>
        ),
      },
      // login - admin
      {
        path: "/auth/admin/login",
        element: (
          <Auth>
            <AdminLoginForm />
          </Auth>
        ),
      },
      // register
      {
        path: "/auth/register/:code?",
        element: (
          <Auth>
            <RegisterForm />
          </Auth>
        ),
      },
      // forgot password
      {
        path: "/auth/forgot-password",
        element: (
          <Auth>
            <RequestCode />
          </Auth>
        ),
      },
      {
        path: "/auth/forgot-password/verify-code",
        element: (
          <Auth>
            <VerifyCode />
          </Auth>
        ),
      },
      {
        path: "/auth/forgot-password/change-password",
        element: (
          <Auth>
            <SetNewPassword />
          </Auth>
        ),
      },
      // email verification
      {
        path: "/auth/verify-email",
        element: <VerifyEmailPage />,
      },

      // private routes
      {
        element: <PrivateRoute />,
        children: [
          ...teacherRoutesConfig,
          ...studentRoutesConfig,
          ...adminRoutesConfig,
        ],
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
  </StrictMode>,
);
