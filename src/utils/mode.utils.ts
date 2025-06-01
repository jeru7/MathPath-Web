// i-comment pag rrun locally for testing
import.meta.env.MODE = "production";

export const URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_PROD_URI
    : import.meta.env.VITE_BACKEND_DEV_URI;
