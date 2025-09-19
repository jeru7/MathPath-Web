import { createContext, useContext } from "react";
import { Admin } from "../types/admin.type";
import { Teacher } from "../../teacher/types/teacher.type";

type AdminContextType = {
  adminId: string;
  admin: Admin | null;
  teachers: Teacher[];
};

export const AdminContext = createContext<AdminContextType | undefined>(
  undefined,
);

export function useAdminContext() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error(
      "useAdminContext must be used only within the AdminProvider.",
    );
  }
  return context;
}
