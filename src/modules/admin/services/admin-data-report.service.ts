import {
  BASE_URI,
  DATA_STALE_TIME,
} from "@/modules/core/constants/api.constant";
import {
  AssessmentAttemptData,
  AssessmentData,
  StageData,
  StudentData,
} from "@/modules/core/types/data-report.type";
import { fetchData } from "@/modules/core/utils/api/api.util";
import { useQuery } from "@tanstack/react-query";

// get student overview data for reports
export const useAdminStudentData = (adminId: string, sectionId?: string) => {
  return useQuery<StudentData[]>({
    queryKey: ["admin", adminId, "student-data", sectionId],
    queryFn: () => {
      const url =
        sectionId && sectionId !== "all"
          ? `${BASE_URI}/api/web/admins/${adminId}/reports/student-overview?sectionId=${sectionId}`
          : `${BASE_URI}/api/web/admins/${adminId}/reports/student-overview`;

      return fetchData<StudentData[]>(url, "Failed to fetch student data.");
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!adminId,
  });
};

// get assessment overview data for reports
export const useAdminAssessmentOverview = (
  adminId: string,
  sectionId?: string,
  assessmentId?: string,
) => {
  return useQuery<AssessmentData[]>({
    queryKey: [
      "admin",
      adminId,
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

      const url = `${BASE_URI}/api/web/admins/${adminId}/reports/assessment-overview?${params}`;

      return fetchData<AssessmentData[]>(
        url,
        "Failed to fetch assessment overview data.",
      );
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!adminId,
  });
};

// get assessment attempts data for reports
export const useAdminAssessmentAttempts = (
  adminId: string,
  sectionId?: string,
  assessmentId?: string,
) => {
  return useQuery<AssessmentAttemptData[]>({
    queryKey: [
      "admin",
      adminId,
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

      const url = `${BASE_URI}/api/web/admins/${adminId}/reports/assessment-attempts?${params}`;

      return fetchData<AssessmentAttemptData[]>(
        url,
        "Failed to fetch assessment attempts data.",
      );
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!adminId,
  });
};

// get combined assessment data (overview + attempts) for reports
export const useAdminAssessmentCombined = (
  adminId: string,
  sectionId?: string,
  assessmentId?: string,
  includeAttempts: boolean = false,
) => {
  return useQuery<{
    overview: AssessmentData[];
    attempts: AssessmentAttemptData[];
  }>({
    queryKey: [
      "admin",
      adminId,
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

      const url = `${BASE_URI}/api/web/admins/${adminId}/reports/assessment-combined?${params}`;

      return fetchData<{
        overview: AssessmentData[];
        attempts: AssessmentAttemptData[];
      }>(url, "Failed to fetch combined assessment data.");
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!adminId,
  });
};

// get stage progress data for reports
export const useAdminStageData = (adminId: string, sectionId?: string) => {
  return useQuery<StageData[]>({
    queryKey: ["admin", adminId, "stage-data", sectionId],
    queryFn: () => {
      const url =
        sectionId && sectionId !== "all"
          ? `${BASE_URI}/api/web/admins/${adminId}/reports/stage-progress?sectionId=${sectionId}`
          : `${BASE_URI}/api/web/admins/${adminId}/reports/stage-progress`;

      return fetchData<StageData[]>(url, "Failed to fetch stage data.");
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!adminId,
  });
};
