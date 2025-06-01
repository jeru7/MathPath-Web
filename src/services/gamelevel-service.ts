import axios from "axios";
import { URL } from "../utils/mode.utils";

export const getGameLevels = async () => {
  const res = await axios.get(`${URL}/api/shared/game-levels`);
  return res.data.data;
};
