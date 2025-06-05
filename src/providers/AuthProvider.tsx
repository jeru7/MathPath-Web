import { useEffect, useState } from "react";
import {
  checkAuthService,
  loginService,
  logoutService,
} from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { IUserLogin } from "../types/user.type";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUserLogin | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await checkAuthService();
        if (user._id && user.role) {
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
      const user = await loginService(identifier, password);
      setUser(user);
      navigate(`/${user.role}/${user._id}`);
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
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
