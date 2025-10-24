import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteData, fetchData, postData } from "../../core/utils/api/api.util";
import { RegistrationCode } from "../../core/types/registration-code/registration-code.type";
import { BASE_URI } from "../../core/constants/api.constant";

export const useTeacherGenerateCode = (teacherId: string) => {
  return useMutation({
    mutationFn: (variables: {
      sectionId: string | null;
      maxUses: number;
      forceReplace: boolean;
    }) => {
      return postData<RegistrationCode, typeof variables>(
        `${BASE_URI}/api/web/teachers/${teacherId}/registration-code`,
        variables,
        "Failed to generate registration code.",
      );
    },
  });
};

export const useTeacherRegistrationCodes = (teacherId: string) => {
  return useQuery<RegistrationCode[]>({
    queryKey: ["teacher", teacherId, "registration-codes"],
    queryFn: () =>
      fetchData<RegistrationCode[]>(
        `${BASE_URI}/api/web/teachers/${teacherId}/registration-code`,
        "Failed to fetch registration codes.",
      ),
    enabled: !!teacherId,
  });
};

export const useTeacherDeleteRegistrationCode = (teacherId: string) => {
  return useMutation({
    mutationFn: (codeId: string) => {
      return deleteData<null>(
        `${BASE_URI}/api/web/teachers/${teacherId}/registration-code/${codeId}`,
        "Failed to delete registration code.",
      );
    },
  });
};
