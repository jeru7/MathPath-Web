// i-comment pag rrun locally for testing
// import.meta.env.MODE = "production";
export const BASE_URI =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_PROD_URI
    : import.meta.env.VITE_BACKEND_DEV_URI;

export const WSS =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_WSS_PROD_URI
    : import.meta.env.VITE_WSS_DEV_URI;

export const DATA_STALE_TIME = 1000 * 60 * 5; // 5 mins
