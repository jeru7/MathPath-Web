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

    console.log(res.data.data);
    return res.data.data;
  } catch (error) {
    console.error(error);
    throw new Error(`User is not authenticated: ${error}`);
  }
};
