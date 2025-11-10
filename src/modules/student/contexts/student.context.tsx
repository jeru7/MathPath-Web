import { createContext, useContext } from "react";
import { Student } from "../types/student.type";
import { StudentActivity } from "@/modules/core/types/activity/activity.type";

type StudentContext = {
  student: Student;
  studentId: string;
  activities: StudentActivity[] | [];
  isActivityLoading: boolean;
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
