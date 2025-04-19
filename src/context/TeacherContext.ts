import { createContext } from "react";

import { IStudent } from "../types/student.type";
import { ISection } from "../types/section.type";
import { IAssessment } from "../types/assessment.type";
import { ITeacher } from "../types/teacher.type";

interface TeacherContextType {
  teacher: ITeacher | null;
  students: IStudent[];
  sections: ISection[];
  assessments: IAssessment[];
  onlineStudents: IStudent[];
}

export const TeacherContext = createContext<TeacherContextType>({
  teacher: null,
  students: [],
  sections: [],
  assessments: [],
  onlineStudents: [],
});
