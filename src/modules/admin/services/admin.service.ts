import { useQuery } from "@tanstack/react-query";
import { Admin } from "../types/admin.type";
import { fetchData } from "../../core/utils/api/api.util";
import { BASE_URI, DATA_STALE_TIME } from "../../core/constants/api.constant";
import { Teacher } from "../../teacher/types/teacher.type";

export const useAdmin = (adminId: string) => {
  return useQuery<Admin>({
    queryKey: ["admin", adminId],
    queryFn: () =>
      fetchData<Admin>(
        `${BASE_URI}/api/web/admins/${adminId}`,
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
        `${BASE_URI}/api/web/admins/${adminId}/teachers`,
        "Failed to fetch teachers.",
      ),
    staleTime: DATA_STALE_TIME,
    enabled: !!adminId,
  });
};
