import { createContext, useContext } from "react";
import { Student } from "../../core/types/student/student.type";
import { Teacher } from "../../core/types/teacher/teacher.type";
import { Section } from "../../core/types/section/section.type";
import { Assessment } from "../../core/types/assessment/assessment.type";

type TeacherContext = {
  teacher: Teacher | null;
  students: Student[];
  sections: Section[];
  assessments: Assessment[];
  onlineStudents: Student[];
};

export const TeacherContext = createContext<TeacherContext>({
  teacher: null,
  students: [],
  sections: [],
  assessments: [],
  onlineStudents: [],
});

export function useTeacherContext() {
  const context = useContext(TeacherContext);
  if (!context) {
    throw new Error(
      "useTeacherContext must be used only within the TeacherProvider.",
    );
  }
  return context;
}
