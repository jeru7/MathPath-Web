import { createContext, useContext } from "react";
import { Admin } from "../types/admin.type";
import { Teacher } from "../../teacher/types/teacher.type";
import { Student } from "../../student/types/student.type";

type AdminContextType = {
  adminId: string;
  admin: Admin | null;
  teachers: Teacher[];
  students: Student[];
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
