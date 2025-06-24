import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { TeacherContext } from "../context/TeacherContext";
import * as teacherService from "../services/teacher.service";
import * as chartService from "../../core/services/chart.service";
import { Teacher } from "../../core/types/teacher/teacher.types";
import { Student } from "../../core/types/student/student.types";
import { Section } from "../../core/types/section/section.types";
import { Assessment } from "../../core/types/assessment/assessment.types";
import { SectionTopicStats, TopicStats } from "../../core/types/chart.types";

const DATA_STALE_TIME = 1000 * 60 * 5; // 5 mins

export function useTeacherContext() {
  const context = useContext(TeacherContext);
  if (!context) {
    throw new Error(
      "useTeacherContext must be used only within the TeacherProvider.",
    );
  }
  return context;
}

// get teacher data - teacher info
export const useTeacher = (teacherId: string) => {
  return useQuery<Teacher | null>({
    queryKey: ["teacher", teacherId],
    queryFn: () => teacherService.getTeacherById(teacherId),
    staleTime: DATA_STALE_TIME,
  });
};

// get teacher students
export const useTeacherStudents = (teacherId: string) => {
  return useQuery<Student[]>({
    queryKey: ["teacher", teacherId, "students"],
    queryFn: () => teacherService.getStudentsByTeacherId(teacherId),
    staleTime: DATA_STALE_TIME,
  });
};

// get teacher sections
export const useTeacherSections = (teacherId: string) => {
  return useQuery<Section[]>({
    queryKey: ["teacher", teacherId, "sections"],
    queryFn: () => teacherService.getSectionsByTeacherId(teacherId),
    staleTime: DATA_STALE_TIME,
  });
};

// get teacher assessments
export const useTeacherAssessments = (teacherId: string) => {
  return useQuery<Assessment[]>({
    queryKey: ["teacher", teacherId, "assessments"],
    queryFn: () => teacherService.getAssessmentsByTeacherId(teacherId),
    staleTime: DATA_STALE_TIME,
  });
};

// topic stats

// get overall topic stats - all students handled by the teacher
export const useTeacherOverallTopicStats = (teacherId: string) => {
  return useQuery<TopicStats[]>({
    queryKey: ["teacher", teacherId, "overall-topic-stats"],
    queryFn: () => chartService.getOverallTopicStats(teacherId),
    staleTime: DATA_STALE_TIME,
  });
};

// get overall topic stats per section - all students (grouped by section) that is handled by the teacher
export const useTeacherSectionTopicStats = (teacherId: string) => {
  return useQuery<SectionTopicStats[]>({
    queryKey: ["teacher", teacherId, "section-topic-stats"],
    queryFn: () => chartService.getPerSectionsTopicStats(teacherId),
    staleTime: DATA_STALE_TIME,
  });
};
