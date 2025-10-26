import { useQuery } from "@tanstack/react-query";
import { Assessment } from "../../core/types/assessment/assessment.type";
import { fetchData } from "../../core/utils/api/api.util";
import { BASE_URI, DATA_STALE_TIME } from "../../core/constants/api.constant";

export const useAdminAssessments = (adminId: string) => {
  return useQuery<Assessment[]>({
    queryKey: ["admin", adminId, "students"],
    queryFn: () =>
      fetchData<Assessment[]>(
        `${BASE_URI}/api/web/admins/${adminId}/students`,
        "Failed to fetch assessments.",
      ),
    staleTime: DATA_STALE_TIME,
    enabled: !!adminId,
  });
};
