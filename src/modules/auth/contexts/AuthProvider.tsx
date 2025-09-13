import { useEffect, useState } from "react";
import {
  checkAuthService,
  loginService,
  logoutService,
  requestPasswordResetCodeService,
} from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { User } from "../../core/types/user.type";
import { AuthContext } from "./auth.context";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user: User = await checkAuthService();
        if (user.id && user.role) {
          setUser(user);
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
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

  const requestPasswordResetCode = async (email: string) => {
    setIsLoading(true);
    try {
      await requestPasswordResetCodeService(email);
    } catch (error) {
      console.error(error);
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
      value={{ user, isLoading, login, logout, requestPasswordResetCode }}
    >
      {children}
    </AuthContext.Provider>
  );
};
