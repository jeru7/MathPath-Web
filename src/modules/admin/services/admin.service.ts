import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Admin } from "../types/admin.type";
import { fetchData, postData } from "../../core/utils/api/api.util";
import { BASE_URI, DATA_STALE_TIME } from "../../core/constants/api.constant";
import { Teacher } from "../../teacher/types/teacher.type";
import { AddTeacherDTO } from "../../teacher/types/teacher.schema";

export const useAdmin = (adminId: string) => {
  return useQuery<Admin>({
    queryKey: ["admin", adminId],
    queryFn: () =>
      fetchData<Admin>(
        `${BASE_URI}/api/web/admin/${adminId}`,
        "Failed to fetch admin.",
      ),
    staleTime: DATA_STALE_TIME,
    enabled: !!adminId,
  });
};

export const useAdminTeacher = (adminId: string) => {
  return useQuery<Teacher[]>({
    queryKey: ["admin", adminId, "teachers"],
    queryFn: () =>
      fetchData<Teacher[]>(
        `${BASE_URI}/api/web/admin/${adminId}/teachers`,
        "Failed to fetch teachers.",
      ),
    staleTime: DATA_STALE_TIME,
    enabled: !!adminId,
  });
};

export const useAdminAddTeacher = (adminId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (teacherData: AddTeacherDTO) => {
      return postData<Teacher, AddTeacherDTO>(
        `${BASE_URI}/api/web/admin/${adminId}/teachers`,
        teacherData,
        "Failed to add new teacher.",
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", adminId, "teachers"],
      });
    },
  });
};
