import { createContext, useContext } from "react";
import { Student } from "../types/student.type";

type StudentContext = {
  student: Student | null;
  studentId: string;
};

export const StudentContext = createContext<StudentContext | undefined>(
  undefined,
);

export function useStudentContext() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error(
      "useStudentContext must be used only within the StudentProvider.",
    );
  }
  return context;
}
