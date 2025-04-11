import { useEffect, useState } from "react"
import { checkAuthService, loginService, logoutService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { UserLoginType } from "../types/user";
import { AuthContext } from "../context/AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserLoginType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await checkAuthService();
        if (user._id && user.role) {
          setUser(user)
        }
      } catch {
        setUser(null)
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await loginService(email, password);
      setUser(user);
      navigate(`/${user.role}s/${user._id}`)
    } catch (error) {
      console.error(error)
      setUser(null);
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (userId: string) => {
    await logoutService(userId);
    setUser(null);
    navigate("/login")
  };

  return < AuthContext.Provider value={{ user, isLoading, login, logout }}> {children}</AuthContext.Provider >
}
