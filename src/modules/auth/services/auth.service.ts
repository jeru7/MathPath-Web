import axios from "axios";
import { User } from "../../core/types/user.type";
import { URL } from "../../core/constants/api.constant";

export const loginService = async (identifier: string, password: string) => {
  try {
    const res = await axios.post<{ data: User }>(
      `${URL}/api/web/auth/login`,
      {
        identifier,
        password,
      },
      { withCredentials: true },
    );

    return res.data.data;
  } catch {
    throw new Error("Failed to log in.");
  }
};

export const checkAuthService = async () => {
  const res = await axios.get<{ data: User }>(
    `${URL}/api/web/auth/auth-check`,
    {
      withCredentials: true,
    },
  );

  return res.data.data;
};

export const logoutService = async (userId: string) => {
  try {
    const res = await axios.post(
      `${URL}/api/web/auth/logout`,
      { userId },
      {
        withCredentials: true,
      },
    );

    console.log(res.data.message);
  } catch (error) {
    console.error(error);
    throw new Error("Logout failed.");
  }
};

export const requestPasswordResetCodeService = async (email: string) => {
  try {
    await axios.post(
      `${URL}/api/web/auth/forgot-password/request`,
      { email },
      { withCredentials: true },
    );
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "UNKNOWN_ERROR");
    }
    throw new Error("Request for reset password failed.");
  }
};

export const verifyPasswordResetCodeService = async (
  email: string,
  code: string,
) => {
  try {
    await axios.post(
      `${URL}/api/web/auth/forgot-password/verify`,
      { email, code },
      { withCredentials: true },
    );
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "UNKNOWN_ERROR");
    }
    throw new Error("Reset password verification failed.");
  }
};

export const setNewPasswordService = async (
  email: string,
  newPassword: string,
) => {
  try {
    await axios.post(
      `${URL}/api/web/auth/forgot-password/change-password`,
      { email, newPassword },
      { withCredentials: true },
    );
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "UNKNOWN_ERROR");
    }
    throw new Error("Reset password failed.");
  }
};
