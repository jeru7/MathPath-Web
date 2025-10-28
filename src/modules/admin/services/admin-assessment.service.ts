import { useMutation, useQuery } from "@tanstack/react-query";
import { Assessment } from "../../core/types/assessment/assessment.type";
import { deleteData, fetchData } from "../../core/utils/api/api.util";
import { BASE_URI, DATA_STALE_TIME } from "../../core/constants/api.constant";

export const useAdminAssessments = (adminId: string) => {
  return useQuery<Assessment[]>({
    queryKey: ["admin", adminId, "assessments"],
    queryFn: () =>
      fetchData<Assessment[]>(
        `${BASE_URI}/api/web/admins/${adminId}/assessments`,
        "Failed to fetch assessments.",
      ),
    staleTime: DATA_STALE_TIME,
    enabled: !!adminId,
  });
};

// WARN: These aren't used yet, we're not sure if the should be able to delete assessments
export const useAdminDeleteAssessment = (adminId: string) => {
  return useMutation({
    mutationFn: (assessmentId: string) => {
      return deleteData<null>(
        `${BASE_URI}/api/web/admins/${adminId}/assessments/${assessmentId}`,
        "Failed to delete assessment.",
      );
    },
  });
};
