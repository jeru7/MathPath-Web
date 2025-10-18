import axios from "axios";
import { User } from "../../core/types/user.type";
import { BASE_URI } from "../../core/constants/api.constant";
import { RegisterStudentDTO } from "../../student/types/student.schema";

export const loginService = async (identifier: string, password: string) => {
  const res = await axios.post<{ data: User }>(
    `${BASE_URI}/api/web/auth/login`,
    {
      identifier,
      password,
    },
    { withCredentials: true },
  );

  return res.data.data;
};

export const checkAuthService = async () => {
  const res = await axios.get<{ data: User }>(
    `${BASE_URI}/api/web/auth/auth-check`,
    {
      withCredentials: true,
    },
  );

  return res.data.data;
};

export const logoutService = async (userId: string) => {
  const res = await axios.post(
    `${BASE_URI}/api/web/auth/logout`,
    { userId },
    {
      withCredentials: true,
    },
  );

  console.log(res.data.message);
};

export const requestPasswordResetCodeService = async (email: string) => {
  await axios.post(
    `${BASE_URI}/api/web/auth/forgot-password/request`,
    { email },
    { withCredentials: true },
  );
};

export const verifyPasswordResetCodeService = async (
  email: string,
  code: string,
) => {
  await axios.post(
    `${BASE_URI}/api/web/auth/forgot-password/verify`,
    { email, code },
    { withCredentials: true },
  );
};

export const changePasswordService = async (
  email: string,
  newPassword: string,
) => {
  await axios.post(
    `${BASE_URI}/api/web/auth/forgot-password/change-password`,
    { email, newPassword },
    { withCredentials: true },
  );
};

export const registerStudentService = async (
  studentData: RegisterStudentDTO,
  code: string,
) => {
  await axios.post(
    `${BASE_URI}/api/web/auth/register`,
    { studentData, code },
    { withCredentials: true },
  );
};

export const verifyEmailService = async (email: string, token: string) => {
  await axios.post(
    `${BASE_URI}/api/web/auth/verify-email`,
    { email, token },
    { withCredentials: true },
  );
};
