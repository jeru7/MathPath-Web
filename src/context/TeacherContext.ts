import { createContext } from "react";
import { StudentType } from "../types/student";
import { SectionType } from "../types/section";
import { AssessmentType } from "../types/assessment";
import { TeacherType } from "../types/teacher";

type TeacherContextType = {
  teacher: TeacherType | null;
  students: StudentType[];
  sections: SectionType[];
  assessments: AssessmentType[];
  onlineStudents: StudentType[];
};

export const TeacherContext = createContext<TeacherContextType>({
  teacher: null,
  students: [],
  sections: [],
  assessments: [],
  onlineStudents: [],
});
