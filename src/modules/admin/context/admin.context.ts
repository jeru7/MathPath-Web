import { createContext, useContext } from "react";
import { Admin } from "../types/admin.type";
import { Teacher } from "../../teacher/types/teacher.type";
import { Student } from "../../student/types/student.type";
import { Section } from "../../core/types/section/section.type";
import { Assessment } from "../../core/types/assessment/assessment.type";

type AdminContextType = {
  adminId: string;
  admin: Admin | null;
  teachers: Teacher[];
  students: Student[];
  sections: Section[];
  assessments: Assessment[];
  onlineStudents: Student[];
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
