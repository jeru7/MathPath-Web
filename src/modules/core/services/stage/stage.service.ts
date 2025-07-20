import axios from "axios";
import { URL } from "../../constants/api.constant";

export const getStages = async () => {
  const res = await axios.get(`${URL}/api/shared/stages`);
  return res.data.data;
};
