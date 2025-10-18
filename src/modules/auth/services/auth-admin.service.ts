import { BASE_URI } from "../../core/constants/api.constant";
import axios from "axios";

export const adminLoginService = async (email: string, password: string) => {
  const res = await axios.post(
    `${BASE_URI}/api/web/auth/admin/login`,
    { email, password },
    { withCredentials: true },
  );

  return res.data.data;
};
