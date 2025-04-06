import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const useAuthCheck = () => {
  const [authStatus, setAuthStatus] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await axios.get("/api/web/auth/auth-check", {
          withCredentials: true,
        });
        if (res.data.data.isLoggedIn) {
          if (res.data.data.role === "teacher") {
            navigate(`/teachers/${res.data.data.userId}`);
          } else if (res.data.data.role === "student") {
            navigate(`/students/${res.data.data.userId}`);
          }

          setAuthStatus(true);
        } else {
          setAuthStatus(false);
        }
      } catch (error) {
        if(axios.isAxiosError(error) && error.response?.data.error === "Not authenticated.") {
          console.log("Authentication error. Please login.")
        }
        setAuthStatus(false);
      }
    };

    checkAuthStatus();
  }, [navigate]);

  return authStatus;
};

export default useAuthCheck;
