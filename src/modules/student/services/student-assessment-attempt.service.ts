import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AssessmentAttempt } from "../../core/types/assessment-attempt/assessment-attempt.type";
import { fetchData, postData } from "../../core/utils/api/api.util";
import { DATA_STALE_TIME, BASE_URI } from "../../core/constants/api.constant";

export const useSubmitAssessmentAttempt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (attempt: AssessmentAttempt) => {
      return postData<AssessmentAttempt, AssessmentAttempt>(
        `${BASE_URI}/api/web/students/${attempt.studentId}/assessment-attempts/${attempt.assessmentId}`,
        attempt,
        "Failed to submit assessment attempt",
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["student", variables.studentId, "assessment-attempts"],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "student",
          variables.studentId,
          "assessment-attempts",
          variables.assessmentId,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "student",
          variables.studentId,
          "assessment-attempts",
          variables.assessmentId,
          "resume",
        ],
      });
      queryClient.removeQueries({
        queryKey: [
          "student",
          variables.studentId,
          "assessment-attempts",
          variables.assessmentId,
          "resume",
        ],
      });
    },
  });
};

export const useSavePausedAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (attempt: AssessmentAttempt) => {
      return postData<AssessmentAttempt, AssessmentAttempt>(
        `${BASE_URI}/api/web/students/${attempt.studentId}/assessment-attempts/${attempt.assessmentId}/pause`,
        attempt,
        "Failed to save paused assessment",
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["student", variables.studentId, "assessment-attempts"],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "student",
          variables.studentId,
          "assessment-attempts",
          variables.assessmentId,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "student",
          variables.studentId,
          "assessments",
          variables.assessmentId,
          "attempts",
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "student",
          variables.studentId,
          "assessment-attempts",
          variables.assessmentId,
          "resume",
        ],
      });
    },
  });
};

export const useResumeAssessment = (
  studentId: string,
  assessmentId: string,
) => {
  return useQuery<AssessmentAttempt>({
    queryKey: [
      "student",
      studentId,
      "assessment-attempts",
      assessmentId,
      "resume",
    ],
    queryFn: () =>
      fetchData<AssessmentAttempt>(
        `${BASE_URI}/api/web/students/${studentId}/assessment-attempts/${assessmentId}/resume`,
        "Failed to resume assessment",
      ),
    staleTime: DATA_STALE_TIME,
    enabled: !!studentId && !!assessmentId,
  });
};

export const useAssessmentAttempt = (
  studentId: string,
  assessmentId: string,
) => {
  return useQuery<AssessmentAttempt[]>({
    queryKey: ["student", studentId, "assessments", assessmentId, "attempts"],
    queryFn: () =>
      fetchData<AssessmentAttempt[]>(
        `${BASE_URI}/api/web/students/${studentId}/assessment-attempts/${assessmentId}`,
        "Failed to fetch assessment attempts.",
      ),
    staleTime: DATA_STALE_TIME,
    enabled: !!studentId && !!assessmentId,
  });
};

export const useAssessmentsAttempts = (studentId: string) => {
  return useQuery<AssessmentAttempt[]>({
    queryKey: ["student", studentId, "assessment-attempts"],
    queryFn: () =>
      fetchData<AssessmentAttempt[]>(
        `${BASE_URI}/api/web/students/${studentId}/assessment-attempts`,
        "Failed to fetch assessment attempts.",
      ),
    staleTime: DATA_STALE_TIME,
    enabled: !!studentId,
  });
};
