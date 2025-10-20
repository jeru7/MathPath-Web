import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangeAccountSettingsRequest } from "../../auth/types/auth-settings.type";
import { Request } from "../../core/types/requests/request.type";
import { fetchData, postData } from "../../core/utils/api/api.util";
import { DATA_STALE_TIME, BASE_URI } from "../../core/constants/api.constant";

export const useSubmitAccountChangeRequest = (studentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { payload: ChangeAccountSettingsRequest }) => {
      return postData<
        { requestId: string; status: string },
        { payload: ChangeAccountSettingsRequest }
      >(
        `${BASE_URI}/api/web/students/${studentId}/requests/account-information`,
        data,
        "Failed to submit account change request.",
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["student", studentId, "requests"],
      });
    },
  });
};

export const useStudentRequests = (studentId: string) => {
  return useQuery<Request[]>({
    queryKey: ["student", studentId, "requests"],
    queryFn: () => {
      return fetchData<Request[]>(
        `${BASE_URI}/api/web/students/${studentId}/requests`,
        "Failed to fetch student requests.",
      );
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!studentId,
  });
};
