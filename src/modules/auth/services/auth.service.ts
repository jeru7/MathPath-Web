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
