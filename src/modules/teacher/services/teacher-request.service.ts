import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Request } from "../../core/types/requests/request.type";
import { fetchData, patchData } from "../../core/utils/api/api.util";
import { DATA_STALE_TIME, BASE_URI } from "../../core/constants/api.constant";

export const useTeacherRequests = (teacherId: string) => {
  return useQuery<Request[]>({
    queryKey: ["teacher", teacherId, "requests"],
    queryFn: () => {
      return fetchData<Request[]>(
        `${BASE_URI}/api/web/teachers/${teacherId}/requests`,
        "Failed to fetch requests.",
      );
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!teacherId,
  });
};

export const useUpdateRequestStatus = (
  teacherId: string,
  requestId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (action: "approve" | "reject") => {
      return patchData<Request, { action: "approve" | "reject" }>(
        `${BASE_URI}/api/web/teachers/${teacherId}/requests/${requestId}`,
        { action },
        "Failed to update request status.",
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher", teacherId, "requests"],
      });
    },
  });
};
