import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Assessment } from "../../types/assessment/assessment.type";
import { deleteData, patchData, postData } from "../../utils/api/api.util";
import { URL } from "../../constants/api.constant";

export const useCreateAssessmentDraft = (teacherId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      return postData<Assessment, undefined>(
        `${URL}/api/web/teachers/${teacherId}/assessments`,
        undefined,
        "Failed to create assessment draft",
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher", teacherId, "assessments"],
      });
    },
  });
};

export const usePublishAssessment = (teacherId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newAssessment: Assessment) => {
      return patchData<Assessment, Assessment>(
        `${URL}/api/web/teachers/${teacherId}/assessments`,
        newAssessment,
        "Failed to publish assessment",
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher", teacherId, "assessments"],
      });

      localStorage.removeItem("currentAssessmentDraftId");
    },
  });
};

export const useUpdateAssessmentDraft = (teacherId: string) => {
  return useMutation({
    mutationFn: (updatedAssessment: Assessment) => {
      return patchData<Assessment, Assessment>(
        `${URL}/api/web/teachers/${teacherId}/assessments/${updatedAssessment.id}`,
        updatedAssessment,
        "Failed to update assessment draft",
      );
    },
  });
};

export const useDeleteAssessment = (teacherId: string) => {
  return useMutation({
    mutationFn: (assessmentId: string) => {
      return deleteData<null>(
        `${URL}/api/web/teachers/${teacherId}/assessments/${assessmentId}`,
        "Failed to delete assessment.",
      );
    },
  });
};

export const useUploadAssessmentImage = (teacherId: string) => {
  return useMutation({
    mutationFn: async (imageFile: File): Promise<string> => {
      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await fetch(
        `${URL}/api/web/teachers/${teacherId}/assessments/images`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to upload image.");
      }

      const data = await res.json();
      return data.data as string;
    },
  });
};
