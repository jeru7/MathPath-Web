import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../core/utils/api/api.util";
import { BASE_URI, DATA_STALE_TIME } from "../../core/constants/api.constant";
import { Teacher } from "../types/teacher.type";

// get teacher data
export const useTeacher = (teacherId: string) => {
  return useQuery<Teacher>({
    queryKey: ["teacher", teacherId],
    queryFn: () =>
      fetchData<Teacher>(
        `${BASE_URI}/api/web/teachers/${teacherId}`,
        "Failed to fetch teacher.",
      ),
    staleTime: DATA_STALE_TIME,
    enabled: !!teacherId,
  });
};
