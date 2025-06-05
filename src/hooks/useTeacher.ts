import { useQuery } from "@tanstack/react-query";
import { TeacherContext } from "../context/TeacherContext";
import {
  getAssessmentsByTeacherId,
  getSectionsByTeacherId,
  getStudentsByTeacherId,
  getTeacherById,
} from "../services/teacher.service";

import { ITeacher } from "../types/teacher.type";
import { IStudent } from "../types/student.type";
import { ISection } from "../types/section.type";
import { IAssessment } from "../types/assessment.type";
import { useContext } from "react";
import { ISectionTopicStats, ITopicStats } from "../types/chart.type";
import {
  getOverallTopicStats,
  getPerSectionsTopicStats,
} from "../services/chart.service";

// 5 mins
const DATA_STALE_TIME = 1000 * 60 * 5;

// context
export function useTeacherContext() {
  const context = useContext(TeacherContext);
  if (!context) {
    throw new Error(
      "useTeacherContext must be used only within the TeacherProvider.",
    );
  }
  return context;
}

// react queries
// get teacher data - teacher info
export const useTeacher = (teacherId: string) => {
  return useQuery<ITeacher | null>({
    queryKey: ["teacher", teacherId],
    queryFn: () => getTeacherById(teacherId),
    staleTime: DATA_STALE_TIME,
  });
};

// get teacher students
export const useTeacherStudents = (teacherId: string) => {
  return useQuery<IStudent[]>({
    queryKey: ["teacher", teacherId, "students"],
    queryFn: () => getStudentsByTeacherId(teacherId),
    staleTime: DATA_STALE_TIME,
  });
};

// get teacher sections
export const useTeacherSections = (teacherId: string) => {
  return useQuery<ISection[]>({
    queryKey: ["teacher", teacherId, "sections"],
    queryFn: () => getSectionsByTeacherId(teacherId),
    staleTime: DATA_STALE_TIME,
  });
};

// get teacher assessments
export const useTeacherAssessments = (teacherId: string) => {
  return useQuery<IAssessment[]>({
    queryKey: ["teacher", teacherId, "assessments"],
    queryFn: () => getAssessmentsByTeacherId(teacherId),
    staleTime: DATA_STALE_TIME,
  });
};

// topic stats

// get overall topic stats - all students handled by the teacher
export const useTeacherOverallTopicStats = (teacherId: string) => {
  return useQuery<ITopicStats[]>({
    queryKey: ["teacher", teacherId, "overall-topic-stats"],
    queryFn: () => getOverallTopicStats(teacherId),
    staleTime: DATA_STALE_TIME,
  });
};

// get overall topic stats per section - all students (grouped by section) that is handled by the teacher
export const useTeacherSectionTopicStats = (teacherId: string) => {
  return useQuery<ISectionTopicStats[]>({
    queryKey: ["teacher", teacherId, "section-topic-stats"],
    queryFn: () => getPerSectionsTopicStats(teacherId),
    staleTime: DATA_STALE_TIME,
  });
};
