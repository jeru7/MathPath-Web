import axios from "axios";

const URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_PROD_URI
    : import.meta.env.VITE_BACKEND_DEV_URI;

export const getGameLevels = async () => {
  const res = await axios.get(`${URL}/api/shared/game-levels`);
  return res.data.data;
};
