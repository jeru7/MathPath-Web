import { useState, useEffect } from "react";

import { UserAuthData } from "../utils/types";

import axios from "axios";

const useAuthCheck = () => {
  const [authData, setAuthData] = useState<{
    status: boolean | null;
    userData?: UserAuthData;
  }>({ status: null });

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const checkAuthStatus = async () => {
      try {
        const res = await axios.get("/api/web/auth/auth-check", {
          withCredentials: true,
          signal: controller.signal,
        });

        if (isMounted) {
          setAuthData({
            status: res.data.data.isLoggedIn,
            userData: res.data.data,
          });
        }
      } catch (error) {
        if (isMounted) {
          if (
            axios.isAxiosError(error) &&
            error.response?.data.error === "Not authenticated."
          ) {
            console.log("Authentication error. Please login.");
          }
          setAuthData({ status: false });
        }
      }
    };

    checkAuthStatus();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return authData;
};

export default useAuthCheck;
