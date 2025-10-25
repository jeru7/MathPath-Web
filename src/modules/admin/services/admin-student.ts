import { useQuery } from "@tanstack/react-query";
import { Student } from "../../student/types/student.type";
import { BASE_URI, DATA_STALE_TIME } from "../../core/constants/api.constant";
import { fetchData } from "../../core/utils/api/api.util";

export const useAdminStudents = (adminId: string) => {
  return useQuery<Student[]>({
    queryKey: ["admin", adminId, "students"],
    queryFn: () =>
      fetchData<Student[]>(
        `${BASE_URI}/api/web/admins/${adminId}`,
        "Failed to fetch teacher.",
      ),
    staleTime: DATA_STALE_TIME,
    enabled: !!adminId,
  });
};
