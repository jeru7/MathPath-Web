import { useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteData,
  fetchData,
  patchData,
  postData,
} from "../../core/utils/api/api.util";
import { Section } from "../../core/types/section/section.type";
import {
  CreateSectionDTO,
  EditSectionDTO,
} from "../../core/types/section/section.schema";
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

// teacher edit section
export const useTeacherEditSection = (teacherId: string) => {
  return useMutation({
    mutationFn: ({
      sectionId,
      sectionData,
    }: {
      sectionId: string;
      sectionData: EditSectionDTO;
    }) => {
      return patchData<Section, EditSectionDTO>(
        `${BASE_URI}/api/web/teachers/${teacherId}/sections/${sectionId}`,
        sectionData,
        "Failed to edit section.",
      );
    },
  });
};

// teacher get archived sections
export const useTeacherArchivedSections = (teacherId: string) => {
  return useQuery<Section[]>({
    queryKey: ["teacher", teacherId, "archived-sections"],
    queryFn: () =>
      fetchData<Section[]>(
        `${BASE_URI}/api/web/teachers/${teacherId}/sections/archive`,
        "Failed to fetch archived sections",
      ),
    enabled: !!teacherId,
    staleTime: DATA_STALE_TIME,
  });
};

// teacher archive section
export const useTeacherArchiveSection = (teacherId: string) => {
  return useMutation({
    mutationFn: (sectionId: string) => {
      return patchData<Section, null>(
        `${BASE_URI}/api/web/teachers/${teacherId}/sections/${sectionId}/archive`,
        null,
        "Failed to archive section.",
      );
    },
  });
};

// teacher restore section
export const useTeacherRestoreSection = (teacherId: string) => {
  return useMutation({
    mutationFn: (sectionId: string) => {
      return patchData<Section, null>(
        `${BASE_URI}/api/web/teachers/${teacherId}/sections/${sectionId}/restore`,
        null,
        "Failed to restore section.",
      );
    },
  });
};
