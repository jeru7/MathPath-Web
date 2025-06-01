import axios from "axios";
import { IUserLogin } from "../types/user.type";
import { URL } from "../utils/mode.utils";

export const loginService = async (email: string, password: string) => {
  try {
    const res = await axios.post<{ data: IUserLogin }>(
      `${URL}/api/web/auth/login`,
      {
        email,
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
  const res = await axios.get<{ data: IUserLogin }>(
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
