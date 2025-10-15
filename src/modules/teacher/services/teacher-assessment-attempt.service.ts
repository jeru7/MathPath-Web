import { useQuery } from "@tanstack/react-query";
import { AssessmentAttempt } from "../../core/types/assessment-attempt/assessment-attempt.type";
import { DATA_STALE_TIME, URL } from "../../core/constants/api.constant";
import { fetchData } from "../../core/utils/api/api.util";

export const useTeacherAssessmentAttempts = (
  teacherId: string,
  assessmentId: string,
) => {
  return useQuery<AssessmentAttempt[]>({
    queryKey: ["teacher", teacherId, "assessment-attempts", assessmentId],
    queryFn: () =>
      fetchData<AssessmentAttempt[]>(
        `${URL}/api/web/teachers/${teacherId}/assessment-attempts/${assessmentId}`,
        "Failed to fetch teacher.",
      ),
    staleTime: DATA_STALE_TIME,
    enabled: !!teacherId && !!assessmentId,
  });
};
