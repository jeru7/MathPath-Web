import { useQuery } from "@tanstack/react-query";
import { BASE_URI, DATA_STALE_TIME } from "../../core/constants/api.constant";
import { fetchData } from "../../core/utils/api/api.util";
import {
  StudentData,
  StageData,
  AssessmentData,
  AssessmentAttemptData,
} from "../types/teacher-data-report";

// get student overview data for reports
export const useTeacherStudentData = (
  teacherId: string,
  sectionId?: string,
) => {
  return useQuery<StudentData[]>({
    queryKey: ["teacher", teacherId, "student-data", sectionId],
    queryFn: () => {
      const url =
        sectionId && sectionId !== "all"
          ? `${BASE_URI}/api/web/teachers/${teacherId}/reports/student-overview?sectionId=${sectionId}`
          : `${BASE_URI}/api/web/teachers/${teacherId}/reports/student-overview`;

      return fetchData<StudentData[]>(url, "Failed to fetch student data.");
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!teacherId,
  });
};

// get assessment overview data for reports
export const useTeacherAssessmentOverview = (
  teacherId: string,
  sectionId?: string,
  assessmentId?: string,
) => {
  return useQuery<AssessmentData[]>({
    queryKey: [
      "teacher",
      teacherId,
      "assessment-overview",
      sectionId,
      assessmentId,
    ],
    queryFn: () => {
      const params = new URLSearchParams();
      if (sectionId && sectionId !== "all")
        params.append("sectionId", sectionId);
      if (assessmentId && assessmentId !== "all")
        params.append("assessmentId", assessmentId);

      const url = `${BASE_URI}/api/web/teachers/${teacherId}/reports/assessment-overview?${params}`;

      return fetchData<AssessmentData[]>(
        url,
        "Failed to fetch assessment overview data.",
      );
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!teacherId,
  });
};

// get assessment attempts data for reports
export const useTeacherAssessmentAttempts = (
  teacherId: string,
  sectionId?: string,
  assessmentId?: string,
) => {
  return useQuery<AssessmentAttemptData[]>({
    queryKey: [
      "teacher",
      teacherId,
      "assessment-attempts",
      sectionId,
      assessmentId,
    ],
    queryFn: () => {
      const params = new URLSearchParams();
      if (sectionId && sectionId !== "all")
        params.append("sectionId", sectionId);
      if (assessmentId && assessmentId !== "all")
        params.append("assessmentId", assessmentId);

      const url = `${BASE_URI}/api/web/teachers/${teacherId}/reports/assessment-attempts?${params}`;

      return fetchData<AssessmentAttemptData[]>(
        url,
        "Failed to fetch assessment attempts data.",
      );
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!teacherId,
  });
};

// get combined assessment data (overview + attempts) for reports
export const useTeacherAssessmentCombined = (
  teacherId: string,
  sectionId?: string,
  assessmentId?: string,
  includeAttempts: boolean = false,
) => {
  return useQuery<{
    overview: AssessmentData[];
    attempts: AssessmentAttemptData[];
  }>({
    queryKey: [
      "teacher",
      teacherId,
      "assessment-combined",
      sectionId,
      assessmentId,
      includeAttempts,
    ],
    queryFn: () => {
      const params = new URLSearchParams();
      if (sectionId && sectionId !== "all")
        params.append("sectionId", sectionId);
      if (assessmentId && assessmentId !== "all")
        params.append("assessmentId", assessmentId);
      if (includeAttempts) params.append("includeAttempts", "true");

      const url = `${BASE_URI}/api/web/teachers/${teacherId}/reports/assessment-combined?${params}`;

      return fetchData<{
        overview: AssessmentData[];
        attempts: AssessmentAttemptData[];
      }>(url, "Failed to fetch combined assessment data.");
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!teacherId,
  });
};

// get stage progress data for reports
export const useTeacherStageData = (teacherId: string, sectionId?: string) => {
  return useQuery<StageData[]>({
    queryKey: ["teacher", teacherId, "stage-data", sectionId],
    queryFn: () => {
      const url =
        sectionId && sectionId !== "all"
          ? `${BASE_URI}/api/web/teachers/${teacherId}/reports/stage-progress?sectionId=${sectionId}`
          : `${BASE_URI}/api/web/teachers/${teacherId}/reports/stage-progress`;

      return fetchData<StageData[]>(url, "Failed to fetch stage data.");
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!teacherId,
  });
};
