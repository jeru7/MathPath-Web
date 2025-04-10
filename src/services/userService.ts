import axios from "axios";

const URL = import.meta.env.VITE_BACKEND_TEST_URI;

export const userLogin = async (email: string, password: string) => {
  try {
    const res = await axios.post(
      `${URL}/api/web/auth/login`,
      {
        email,
        password,
      },
      { withCredentials: true },
    );

    console.log(res.data.data);

    return res.data.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to log in.");
  }
};

export const checkAuth = async () => {
  try {
    const res = await axios.get(`${URL}/api/web/auth/auth-check`, {
      withCredentials: true,
    });

    return res.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return { isLoggedIn: false };
      }
    }

    throw new Error("Server error while checking auth.");
  }
};

export const userLogout = async (userId: string) => {
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
