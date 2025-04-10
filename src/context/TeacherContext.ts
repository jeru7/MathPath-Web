import { createContext } from "react";
import { Student } from "../types/student";
import { Section } from "../types/section";
import { Assessment } from "../types/assessment";
import { Teacher } from "../types/teacher";

interface ITeacherData {
  teacher: Teacher | null;
  students: Student[];
  sections: Section[];
  assessments: Assessment[];
  onlineStudents: Student[];
}

export const TeacherContext = createContext<ITeacherData | null>(null);
