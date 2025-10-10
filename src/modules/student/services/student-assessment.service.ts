import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData, postData } from "../../core/utils/api/api.util";
import { Assessment } from "../../core/types/assessment/assessment.type";
import { AssessmentAttempt } from "../../core/types/assessment-attempt/assessment-attempt.type";
import { URL } from "../../core/constants/api.constant";

// single assessment
export const useStudentAssessment = (
  studentId: string,
  assessmentId: string,
) => {
  return useQuery({
    queryKey: ["student", studentId, "assessments", assessmentId],
    queryFn: async () => {
      return fetchData<Assessment>(
        `${URL}/api/web/students/${studentId}/assessments/${assessmentId}`,
        "Failed to fetch assessment",
      );
    },
    enabled: !!studentId && !!assessmentId,
  });
};

// all assessments
export const useStudentAssessments = (studentId: string) => {
  return useQuery<Assessment[]>({
    queryKey: ["student", studentId, "assessments"],
    queryFn: async () => {
      return fetchData<Assessment[]>(
        `${URL}/api/web/students/${studentId}/assessments`,
        "Failed to fetch student assessments",
      );
    },
    enabled: !!studentId,
    initialData: [],
  });
};

export const useSubmitAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (attempt: AssessmentAttempt) => {
      return postData<AssessmentAttempt, AssessmentAttempt>(
        `/api/web/students/${attempt.studentId}/assessments/${attempt.assessmentId}/attempts`,
        attempt,
        "Failed to submit assessment",
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["student", variables.studentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["student", variables.studentId, "assessments"],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "student",
          variables.studentId,
          "assessments",
          variables.assessmentId,
        ],
      });
    },
  });
};
