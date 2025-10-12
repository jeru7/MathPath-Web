import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../core/utils/api/api.util";
import { Assessment } from "../../core/types/assessment/assessment.type";
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
