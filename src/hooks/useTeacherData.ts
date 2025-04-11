import { useQuery } from "@tanstack/react-query";
import { TeacherContext } from "../context/TeacherContext";
import {
  getAssessmentsByTeacherId,
  getOnlineStudentsByTeacherId,
  getSectionsByTeacherId,
  getStudentsByTeacherId,
  getTeacherById,
} from "../services/teacherService";

import { TeacherType } from "../types/teacher";
import { StudentType } from "../types/student";
import { SectionType } from "../types/section";
import { AssessmentType } from "../types/assessment";
import { useContext } from "react";

export function useTeacherContext() {
  const context = useContext(TeacherContext);
  if (!context) {
    throw new Error(
      "useTeacherContext must be used only within the TeacherProvider.",
    );
  }
  return context;
}

export const useTeacher = (teacherId: string) => {
  return useQuery<TeacherType | null>({
    queryKey: ["teacher", teacherId],
    queryFn: () => getTeacherById(teacherId),
    staleTime: 1000 * 60 * 5,
  });
};

export const useTeacherStudents = (teacherId: string) => {
  return useQuery<StudentType[]>({
    queryKey: ["teacher", teacherId, "students"],
    queryFn: () => getStudentsByTeacherId(teacherId),
    staleTime: 1000 * 60 * 5,
  });
};

export const useTeacherOnlineStudents = (teacherId: string) => {
  return useQuery<StudentType[]>({
    queryKey: ["teacher", teacherId, "onlineStudents"],
    queryFn: () => getOnlineStudentsByTeacherId(teacherId),
    staleTime: 1000 * 60 * 5,
  });
};

export const useTeacherSections = (teacherId: string) => {
  return useQuery<SectionType[]>({
    queryKey: ["teacher", teacherId, "sections"],
    queryFn: () => getSectionsByTeacherId(teacherId),
    staleTime: 1000 * 60 * 5,
  });
};

export const useTeacherAssessments = (teacherId: string) => {
  return useQuery<AssessmentType[]>({
    queryKey: ["teacher", teacherId, "assessments"],
    queryFn: () => getAssessmentsByTeacherId(teacherId),
    staleTime: 1000 * 60 * 5,
  });
};
