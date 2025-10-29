import { useMutation, useQuery } from "@tanstack/react-query";
import { Section } from "../../core/types/section/section.type";
import {
  deleteData,
  fetchData,
  patchData,
  postData,
} from "../../core/utils/api/api.util";
import { BASE_URI, DATA_STALE_TIME } from "../../core/constants/api.constant";
import {
  CreateSectionDTO,
  EditSectionDTO,
} from "../../core/types/section/section.schema";

// get admin sections
export const useAdminSections = (adminId: string) => {
  return useQuery<Section[]>({
    queryKey: ["admin", adminId, "sections"],
    queryFn: () =>
      fetchData<Section[]>(
        `${BASE_URI}/api/web/admins/${adminId}/sections`,
        "Failed to fetch sections",
      ),
    staleTime: DATA_STALE_TIME,
    enabled: !!adminId,
  });
};

// admin create section
export const useAdminCreateSection = (adminId: string) => {
  return useMutation({
    mutationFn: (sectionData: CreateSectionDTO) => {
      return postData<Section, CreateSectionDTO>(
        `${BASE_URI}/api/web/admins/${adminId}/sections`,
        sectionData,
        "Failed to create a new section.",
      );
    },
  });
};

// admin delete section
export const useAdminDeleteSection = (adminId: string) => {
  return useMutation({
    mutationFn: (sectionId: string) => {
      return deleteData<null>(
        `${BASE_URI}/api/web/admins/${adminId}/sections/${sectionId}`,
        "Failed to create a new section.",
      );
    },
  });
};

// admin edit section
export const useAdminEditSection = (adminId: string) => {
  return useMutation({
    mutationFn: ({
      sectionId,
      sectionData,
    }: {
      sectionId: string;
      sectionData: EditSectionDTO;
    }) => {
      return patchData<Section, EditSectionDTO>(
        `${BASE_URI}/api/web/admins/${adminId}/sections/${sectionId}`,
        sectionData,
        "Failed to edit section.",
      );
    },
  });
};
