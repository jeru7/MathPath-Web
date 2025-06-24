import { createContext } from "react";
import { User } from "../../core/types/user.type";

type AuthContext = {
  user: User | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: (userId: string) => void;
};

export const AuthContext = createContext<AuthContext | undefined>(undefined);
