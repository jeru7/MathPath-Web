import { URL } from "../../constants/api.constant";
import { CreateSectionDTO } from "../../types/section/section.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchData } from "../../utils/api/api.util";
import { Section } from "../../types/section/section.type";

export const useCreateSection = (teacherId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newSection: CreateSectionDTO) => {
      return patchData<Section, CreateSectionDTO>(
        `${URL}/api/web/teachers/${teacherId}/create`,
        newSection,
        "Failed to create a new section.",
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher", teacherId, "sections"],
      });
    },
  });
};
