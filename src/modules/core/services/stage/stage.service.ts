import { useQuery } from "@tanstack/react-query";
import { Stage } from "../../types/stage/stage.type";
import { fetchData } from "../../utils/api/api.util";
import { BASE_URI } from "../../constants/api.constant";

export const useStages = () => {
  return useQuery<Stage[]>({
    queryKey: ["stages"],
    queryFn: () => {
      return fetchData<Stage[]>(
        `${BASE_URI}/api/shared/stages`,
        "Failed to fetch stages data.",
      );
    },
  });
};
