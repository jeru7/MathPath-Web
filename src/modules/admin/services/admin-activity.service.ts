import {
  BASE_URI,
  DATA_STALE_TIME,
} from "@/modules/core/constants/api.constant";
import { AdminActivity } from "@/modules/core/types/activity/activity.type";
import { fetchData } from "@/modules/core/utils/api/api.util";
import { useQuery } from "@tanstack/react-query";

export const useAdminActivities = (adminId: string) => {
  return useQuery<AdminActivity[]>({
    queryKey: ["admin", adminId, "activities"],
    queryFn: () =>
      fetchData<AdminActivity[]>(
        `${BASE_URI}/api/web/admins/${adminId}/activities`,
        "Failed to fetch activities.",
      ),
    staleTime: DATA_STALE_TIME,
    enabled: !!adminId,
  });
};
