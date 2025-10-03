import {
  checkAuthService,
  loginService,
  logoutService,
} from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./auth.context";
import { adminLoginService } from "../services/auth-admin.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: user, isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: checkAuthService,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: ({
      identifier,
      password,
    }: {
      identifier: string;
      password: string;
    }) => loginService(identifier, password),
    onSuccess: (loggedUser) => {
      queryClient.setQueryData(["auth"], loggedUser);
      navigate(`/${loggedUser.role}/${loggedUser.id}`);
    },
  });

  const adminLoginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      adminLoginService(email, password),
    onSuccess: (loggedUser) => {
      queryClient.setQueryData(["auth"], loggedUser);
      navigate(`/${loggedUser.role}/${loggedUser.id}`);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: (userId: string) => logoutService(userId),
    onSuccess: () => {
      queryClient.setQueryData(["auth"], null);
      navigate("/auth/login");
    },
  });

  const login = (identifier: string, password: string) =>
    loginMutation.mutateAsync({ identifier, password });

  const adminLogin = (email: string, password: string) =>
    adminLoginMutation.mutateAsync({ email, password });

  const logout = (userId: string) => logoutMutation.mutateAsync(userId);

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
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
