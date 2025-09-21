import { useEffect, useState } from "react";
import {
  checkAuthService,
  loginService,
  logoutService,
} from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { User } from "../../core/types/user.type";
import { AuthContext } from "./auth.context";
import { adminLoginService } from "../services/auth-admin.service";

const SESSION_USER_KEY = "authUser";
const SESSION_TIMESTAMP_KEY = "authUserTimestamp";
const REFRESH_INTERVAL = 30 * 60 * 1000;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = sessionStorage.getItem(SESSION_USER_KEY);
      const storedTimestamp = sessionStorage.getItem(SESSION_TIMESTAMP_KEY);
      const now = Date.now();

      if (
        storedUser &&
        storedTimestamp &&
        now - Number(storedTimestamp) < REFRESH_INTERVAL
      ) {
        const parsedUser: User = JSON.parse(storedUser);
        if (parsedUser.id && parsedUser.role) {
          setUser(parsedUser);
          setIsLoading(false);
          return;
        }
      }

      // validate
      try {
        const freshUser: User = await checkAuthService();
        if (freshUser.id && freshUser.role) {
          setUser(freshUser);
          sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(freshUser));
          sessionStorage.setItem(SESSION_TIMESTAMP_KEY, String(Date.now()));
        } else {
          setUser(null);
          sessionStorage.removeItem(SESSION_USER_KEY);
          sessionStorage.removeItem(SESSION_TIMESTAMP_KEY);
        }
      } catch {
        setUser(null);
        sessionStorage.removeItem(SESSION_USER_KEY);
        sessionStorage.removeItem(SESSION_TIMESTAMP_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      const loggedUser: User = await loginService(identifier, password);
      if (loggedUser.id && loggedUser.role) {
        setUser(loggedUser);
        sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(loggedUser));
        sessionStorage.setItem(SESSION_TIMESTAMP_KEY, String(Date.now()));
        navigate(`/${loggedUser.role}/${loggedUser.id}`);
      }
    } catch (error) {
      setUser(null);
      sessionStorage.removeItem(SESSION_USER_KEY);
      sessionStorage.removeItem(SESSION_TIMESTAMP_KEY);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const adminLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const loggedUser: User = await adminLoginService(email, password);
      if (loggedUser.id && loggedUser.role) {
        setUser(loggedUser);
        sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(loggedUser));
        sessionStorage.setItem(SESSION_TIMESTAMP_KEY, String(Date.now()));
        navigate(`/${loggedUser.role}/${loggedUser.id}`);
      }
    } catch (error) {
      setUser(null);
      sessionStorage.removeItem(SESSION_USER_KEY);
      sessionStorage.removeItem(SESSION_TIMESTAMP_KEY);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (userId: string) => {
    await logoutService(userId);
    setUser(null);
    sessionStorage.removeItem(SESSION_USER_KEY);
    sessionStorage.removeItem(SESSION_TIMESTAMP_KEY);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        adminLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
