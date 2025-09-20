import { createContext, useContext } from "react";
import { Section } from "../../core/types/section/section.type";
import { Assessment } from "../../core/types/assessment/assessment.type";
import { Student } from "../../student/types/student.type";
import { Teacher } from "../types/teacher.type";

type TeacherContext = {
  teacherId: string;
  teacher: Teacher | null;
  students: Student[];
  sections: Section[];
  assessments: Assessment[];
  onlineStudents: Student[];
};

export const TeacherContext = createContext<TeacherContext | undefined>(
  undefined,
);

export function useTeacherContext() {
  const context = useContext(TeacherContext);
  if (!context) {
    throw new Error(
      "useTeacherContext must be used only within the TeacherProvider.",
    );
  }
  return context;
}
