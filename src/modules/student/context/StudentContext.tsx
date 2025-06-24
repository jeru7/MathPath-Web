import { createContext } from "react";
import { Student } from "../../core/types/student/student.types";

type StudentContext = {
  student: Student | null;
};

export const StudentContext = createContext<StudentContext>({
  student: null,
});
