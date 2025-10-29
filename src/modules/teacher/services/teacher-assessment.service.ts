import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DATA_STALE_TIME, BASE_URI } from "../../core/constants/api.constant";
import { Assessment } from "../../core/types/assessment/assessment.type";
import {
  deleteData,
  fetchData,
  patchData,
  postData,
} from "../../core/utils/api/api.util";

// get teacher assessments
export const useTeacherAssessments = (teacherId: string) => {
  return useQuery<Assessment[] | []>({
    queryKey: ["teacher", teacherId, "assessments"],
    queryFn: () => {
      return fetchData<Assessment[] | []>(
        `${BASE_URI}/api/web/teachers/${teacherId}/assessments`,
        "Failed to fetch assessments",
      );
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!teacherId,
  });
};

// get single assessment
export const useTeacherAssessment = (
  teacherId: string,
  assessmentId: string,
) => {
  return useQuery<Assessment>({
    queryKey: ["teacher", teacherId, "assessments", assessmentId],
    queryFn: () =>
      fetchData<Assessment>(
        `${BASE_URI}/api/web/teachers/${teacherId}/assessments/${assessmentId}`,
        "Failed to fetch assessment",
      ),
    enabled: !!teacherId && !!assessmentId,
    staleTime: DATA_STALE_TIME,
  });
};

export const useCreateAssessmentDraft = (teacherId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      return postData<Assessment, undefined>(
        `${BASE_URI}/api/web/teachers/${teacherId}/assessments`,
        undefined,
        "Failed to create assessment draft",
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher", teacherId, "assessments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["teacher", teacherId, "assessment-status"],
      });
    },
  });
};

export const usePublishAssessment = (teacherId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (assessmentToPublish: Assessment) => {
      // first, ensure the draft is up to date with latest changes
      await patchData<Assessment, Assessment>(
        `${BASE_URI}/api/web/teachers/${teacherId}/assessments/${assessmentToPublish.id}`,
        assessmentToPublish,
        "Failed to update assessment draft before publishing",
      );

      // then publish the assessment with proper status
      return patchData<Assessment, Assessment>(
        `${BASE_URI}/api/web/teachers/${teacherId}/assessments/${assessmentToPublish.id}/publish`,
        {
          ...assessmentToPublish,
          status: "published",
        },
        "Failed to publish assessment",
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher", teacherId, "assessments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["teacher", teacherId, "assessment-status"],
      });
      localStorage.removeItem("currentAssessmentDraftId");
    },
  });
};

export const useUpdateAssessmentDraft = (teacherId: string) => {
  return useMutation({
    mutationFn: (updatedAssessment: Assessment) => {
      return patchData<Assessment, Assessment>(
        `${BASE_URI}/api/web/teachers/${teacherId}/assessments/${updatedAssessment.id}`,
        updatedAssessment,
        "Failed to update assessment draft",
      );
    },
  });
};

export const useDeleteAssessment = (teacherId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (assessmentId: string) => {
      return deleteData<null>(
        `${BASE_URI}/api/web/teachers/${teacherId}/assessments/${assessmentId}`,
        "Failed to delete assessment.",
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher", teacherId, "assessments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["teacher", teacherId, "assessment-status"],
      });
    },
  });
};
