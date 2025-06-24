import { createContext } from "react";
import { Student } from "../../core/types/student/student.types";
import { Teacher } from "../../core/types/teacher/teacher.types";
import { Section } from "../../core/types/section/section.types";
import { Assessment } from "../../core/types/assessment/assessment.types";

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
