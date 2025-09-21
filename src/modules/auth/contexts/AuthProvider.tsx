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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const authChecked = sessionStorage.getItem("authChecked");
      if (authChecked) {
        setIsLoading(false);
        return;
      }

      try {
        const user: User = await checkAuthService();
        setUser(user);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
        sessionStorage.setItem("authChecked", "true");
      }
    };

    loadUser();
  }, []);

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      const user: User = await loginService(identifier, password);
      setUser(user);
      navigate(`/${user.role}/${user.id}`);
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const adminLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const user: User = await adminLoginService(email, password);
      setUser(user);
      navigate(`/${user.role}/${user.id}`);
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (userId: string) => {
    await logoutService(userId);
    setUser(null);
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
