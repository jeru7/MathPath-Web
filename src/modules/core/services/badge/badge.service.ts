import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../utils/api/api.util";
import { BASE_URI } from "../../constants/api.constant";
import { Badge } from "../../types/badge/badge.type";

export const useBadges = () => {
  return useQuery<Badge[]>({
    queryKey: ["stages"],
    queryFn: () => {
      return fetchData<Badge[]>(
        `${BASE_URI}/api/shared/badges`,
        "Failed to fetch stages data.",
      );
    },
  });
};
