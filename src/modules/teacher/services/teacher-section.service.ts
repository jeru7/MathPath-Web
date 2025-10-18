import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteData, fetchData, postData } from "../../core/utils/api/api.util";
import { Section } from "../../core/types/section/section.type";
import { CreateSectionDTO } from "../../core/types/section/section.schema";
import { DATA_STALE_TIME, BASE_URI } from "../../core/constants/api.constant";

// get teacher sections
export const useTeacherSections = (teacherId: string) => {
  return useQuery<Section[] | []>({
    queryKey: ["teacher", teacherId, "sections"],
    queryFn: () => {
      return fetchData<Section[] | []>(
        `${BASE_URI}/api/web/teachers/${teacherId}/sections`,
        "Failed to fetch sections",
      );
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!teacherId,
  });
};

// teacher create section
export const useTeacherCreateSection = (teacherId: string) => {
  return useMutation({
    mutationFn: (sectionData: CreateSectionDTO) => {
      return postData<Section, CreateSectionDTO>(
        `${BASE_URI}/api/web/teachers/${teacherId}/sections`,
        sectionData,
        "Failed to create a new section.",
      );
    },
  });
};

// teacher delete section
export const useTeacherDeleteSection = (teacherId: string) => {
  return useMutation({
    mutationFn: (sectionId: string) => {
      return deleteData<null>(
        `${BASE_URI}/api/web/teachers/${teacherId}/sections/${sectionId}`,
        "Failed to create a new section.",
      );
    },
  });
};
