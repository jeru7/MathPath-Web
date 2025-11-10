import { createContext, useContext } from "react";
import { Section } from "../../core/types/section/section.type";
import { Assessment } from "../../core/types/assessment/assessment.type";
import { Student } from "../../student/types/student.type";
import { Teacher } from "../types/teacher.type";
import { Request } from "../../core/types/requests/request.type";
import { AdminTeacherStudentActivity } from "@/modules/core/types/activity/activity.type";

type TeacherContext = {
  teacherId: string;
  teacher: Teacher | null;
  allStudents: Student[];
  rawStudents: Student[];
  archivedStudents: Student[];
  allSections: Section[];
  rawSections: Section[];
  archivedSections: Section[];
  allAssessments: Assessment[];
  rawAssessments: Assessment[];
  archivedAssessments: Assessment[];
  requests: Request[];
  activities: AdminTeacherStudentActivity[];
  onlineStudents: Student[];

  // loading states
  isLoadingTeacher: boolean;
  isLoadingStudents: boolean;
  isLoadingSections: boolean;
  isLoadingAssessments: boolean;
  isLoadingRequests: boolean;
  isLoadingActivities: boolean;

  isCriticalDataLoaded: boolean;

  isLoading?: boolean;
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
