import { createContext, useContext } from "react";
import { Student } from "../types/student.type";

type StudentContext = {
  student: Student | null;
};

export const StudentContext = createContext<StudentContext>({
  student: null,
});

export function useStudentContext() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error(
      "useStudentContext must be used only within the StudentProvider.",
    );
  }
  return context;
}
