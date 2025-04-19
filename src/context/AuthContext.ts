import { createContext } from "react";
import { IUserLogin } from "../types/user.type";

type AuthContextType = {
  user: IUserLogin | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: (userId: string) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
