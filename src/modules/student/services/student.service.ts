import { BASE_URI } from "../../core/constants/api.constant";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../core/utils/api/api.util";
import { StageAttempt } from "../../core/types/stage-attempt/stage-attempt.type";
import { ProgressLog } from "../../core/types/progress-log/progress-log.type";
import { Section } from "../../core/types/section/section.type";
import { Student } from "../types/student.type";

// get student data
export const useStudent = (studentId: string) => {
  return useQuery<Student>({
    queryKey: ["student", studentId, "student-data"],
    queryFn: () => {
      return fetchData<Student>(
        `${BASE_URI}/api/web/students/${studentId}`,
        "Failed to fetch student data.",
      );
    },
    enabled: !!studentId,
  });
};

// get student section
export const useStudentSection = (studentId: string, sectionId: string) => {
  return useQuery<Section>({
    queryKey: ["student", studentId, "section", sectionId],
    queryFn: () => {
      return fetchData<Section>(
        `${BASE_URI}/api/web/students/${studentId}/sections/${sectionId}`,
        "Failed to fetch student section data.",
      );
    },
    enabled: !!studentId && !!sectionId,
  });
};

// get student stage attempts
export const useStudentAttempts = (studentId: string) => {
  return useQuery<StageAttempt[]>({
    queryKey: ["student", studentId, "attempts"],
    queryFn: () => {
      return fetchData<StageAttempt[]>(
        `${BASE_URI}/api/web/students/${studentId}/stage-attempts`,
        "Failed to fetch student attempts.",
      );
    },
    enabled: !!studentId,
  });
};

// get student progress logs
export const useStudentProgressLog = (studentId: string) => {
  return useQuery<ProgressLog[]>({
    queryKey: ["student", studentId, "progress-log"],
    queryFn: () => {
      return fetchData<ProgressLog[]>(
        `${BASE_URI}/api/web/students/${studentId}/progress-logs`,
        "Failed to fetch student progress logs",
      );
    },
    enabled: !!studentId,
  });
};
