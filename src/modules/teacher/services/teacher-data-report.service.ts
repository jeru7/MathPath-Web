import { useQuery } from "@tanstack/react-query";
import { BASE_URI, DATA_STALE_TIME } from "../../core/constants/api.constant";
import { fetchData } from "../../core/utils/api/api.util";
import {
  StudentData,
  AssessmentData,
  StageData,
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

// get assessment data for reports
export const useTeacherAssessmentData = (
  teacherId: string,
  sectionId?: string,
  assessmentId?: string,
) => {
  return useQuery<AssessmentData[]>({
    queryKey: [
      "teacher",
      teacherId,
      "assessment-data",
      sectionId,
      assessmentId,
    ],
    queryFn: () => {
      let url = `${BASE_URI}/api/web/teachers/${teacherId}/reports/assessment-results`;

      const params = new URLSearchParams();
      if (sectionId && sectionId !== "all") {
        params.append("sectionId", sectionId);
      }
      if (assessmentId) {
        params.append("assessmentId", assessmentId);
      }

      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      return fetchData<AssessmentData[]>(
        url,
        "Failed to fetch assessment data.",
      );
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
