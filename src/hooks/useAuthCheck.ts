import { useState, useEffect } from "react";

import { UserAuth } from "../types/user";

import axios from "axios";
import { checkAuth } from "../services/userService";

const useAuthCheck = () => {
  const [authData, setAuthData] = useState<UserAuth>({
    userId: "",
    role: undefined,
    isLoggedIn: null,
  });

  useEffect(() => {
    let isMounted = true;

    const checkAuthStatus = async () => {
      try {
        const { userId, role, isLoggedIn }: UserAuth = await checkAuth();

        if (isMounted) {
          setAuthData({
            userId,
            role,
            isLoggedIn,
          });
        }
      } catch (error) {
        if (isMounted) {
          if (
            axios.isAxiosError(error) &&
            error.response?.data.error === "Invalid token."
          ) {
            console.log("Authentication error. Please login.");
          }
        }
        setAuthData((prev) => ({
          ...prev,
          isLoggedIn: false,
        }));
      }
    };

    checkAuthStatus();
    return () => {
      isMounted = false;
    };
  }, []);

  return authData;
};

export default useAuthCheck;
