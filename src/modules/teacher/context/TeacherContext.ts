import { createContext } from "react";

import { Student } from "../types/student/student.types";
import { Section } from "../types/section/section.types";
import { Assessment } from "../types/assessment/assessment.types";
import { Teacher } from "../types/teacher/teacher.types";

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
