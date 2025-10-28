import { useQuery } from "@tanstack/react-query";
import { AssessmentAttempt } from "../../core/types/assessment-attempt/assessment-attempt.type";
import { fetchData } from "../../core/utils/api/api.util";
import { BASE_URI, DATA_STALE_TIME } from "../../core/constants/api.constant";

export const useAdminAssessmentAttempts = (
  adminId: string,
  assessmentId: string,
) => {
  return useQuery<AssessmentAttempt[]>({
    queryKey: ["admin", adminId, "assessment-attempts", assessmentId],
    queryFn: () =>
      fetchData<AssessmentAttempt[]>(
        `${BASE_URI}/api/web/admins/${adminId}/assessment-attempts/${assessmentId}`,
        "Failed to fetch teacher.",
      ),
    staleTime: DATA_STALE_TIME,
    enabled: !!adminId && !!assessmentId,
  });
};

export const useAdminAssessmentsAttempts = (adminId: string) => {
  return useQuery<AssessmentAttempt[]>({
    queryKey: ["admin", adminId, "assessment-attempts"],
    queryFn: () =>
      fetchData<AssessmentAttempt[]>(
        `${BASE_URI}/api/web/admins/${adminId}/assessment-attempts`,
        "Failed to fetch teacher.",
      ),
    staleTime: DATA_STALE_TIME,
    enabled: !!adminId,
  });
};
