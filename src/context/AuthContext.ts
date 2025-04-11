import { createContext } from "react";
import { UserLoginType } from "../types/user";

type AuthContextType = {
  user: UserLoginType | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: (userId: string) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
