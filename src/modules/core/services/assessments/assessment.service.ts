import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Assessment } from "../../types/assessment/assessment.type";
import { postData } from "../../utils/api/api.util";
import { CreateAssessmentDTO } from "../../types/assessment/assessment.dto";

export const useAddAssessment = (teacherId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newAssessment: Assessment) =>
      postData<Assessment, CreateAssessmentDTO>(
        `${URL}/api/web/teachers/${teacherId}/assessments`,
        newAssessment,
        "Failed to create assessment",
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher", teacherId, "assessments"],
      });
    },
  });
};
