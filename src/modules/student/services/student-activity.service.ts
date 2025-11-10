import {
  BASE_URI,
  DATA_STALE_TIME,
} from "@/modules/core/constants/api.constant";
import { StudentActivity } from "@/modules/core/types/activity/activity.type";
import { fetchData } from "@/modules/core/utils/api/api.util";
import { useQuery } from "@tanstack/react-query";

export const useStudentActivities = (studentId: string) => {
  return useQuery<StudentActivity[]>({
    queryKey: ["student", studentId, "activities"],
    queryFn: () =>
      fetchData<StudentActivity[]>(
        `${BASE_URI}/api/web/students/${studentId}/activities`,
        "Failed to fetch assessment attempts.",
      ),
    staleTime: DATA_STALE_TIME,
    enabled: !!studentId,
  });
};
