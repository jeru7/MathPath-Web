import axios from "axios";

// i-comment pag rrun locally for testing
// import.meta.env.MODE = "production";

const URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_PROD_URI
    : import.meta.env.VITE_BACKEND_DEV_URI;

export const getGameLevels = async () => {
  const res = await axios.get(`${URL}/api/shared/game-levels`);
  return res.data.data;
};
