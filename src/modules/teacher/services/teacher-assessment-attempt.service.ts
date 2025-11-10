import { useQuery } from "@tanstack/react-query";
import { AssessmentAttempt } from "../../core/types/assessment-attempt/assessment-attempt.type";
import { BASE_URI, DATA_STALE_TIME } from "../../core/constants/api.constant";
import { fetchData } from "../../core/utils/api/api.util";

// get all assessment attempts ng single assessment
export const useTeacherAssessmentAttempts = (
  teacherId: string,
  assessmentId: string,
) => {
  return useQuery<AssessmentAttempt[]>({
    queryKey: ["teacher", teacherId, "assessment-attempts", assessmentId],
    queryFn: () =>
      fetchData<AssessmentAttempt[]>(
        `${BASE_URI}/api/web/teachers/${teacherId}/assessment-attempts/${assessmentId}`,
        "Failed to fetch teacher.",
      ),
    staleTime: DATA_STALE_TIME,
    enabled: !!teacherId && !!assessmentId,
  });
};
