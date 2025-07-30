import { URL } from "../../constants/api.constant";
import { useQuery } from "@tanstack/react-query";
import { Stage } from "../../types/stage/stage.type";
import { fetchData } from "../../utils/api/api.util";

export const useStages = () => {
  return useQuery<Stage[]>({
    queryKey: ["stages"],
    queryFn: () => {
      return fetchData<Stage[]>(
        `${URL}/api/shared/stages`,
        "Failed to fetch stages data.",
      );
    },
  });
};
