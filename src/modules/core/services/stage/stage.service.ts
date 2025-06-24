import axios from "axios";
import { URL } from "../../utils/mode.utils";

export const getStages = async () => {
  const res = await axios.get(`${URL}/api/shared/stages`);
  return res.data.data;
};
