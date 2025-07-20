import { useQuery } from "@tanstack/react-query";
import { SectionTopicStats, TopicStats } from "../../core/types/chart.type";
import { DATA_STALE_TIME, URL } from "../../core/constants/api.constant";
import { fetchData } from "../../core/utils/api/api.util";

// get overall topic stats - all students handled by the teacher
export const useTeacherOverallTopicStats = (teacherId: string) => {
  return useQuery<TopicStats[] | []>({
    queryKey: ["teacher", teacherId, "overall-topic-stats"],
    queryFn: () => {
      return fetchData<TopicStats[] | []>(
        `${URL}/api/web/teachers/${teacherId}/topic-stats/per-section`,
        "Failed to fetch overall topic stats.",
      );
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!teacherId,
  });
};

// get overall topic stats per section - all students (grouped by section) that is handled by the teacher
export const useTeacherSectionTopicStats = (teacherId: string) => {
  return useQuery<SectionTopicStats[] | []>({
    queryKey: ["teacher", teacherId, "section-topic-stats"],
    queryFn: () => {
      return fetchData<SectionTopicStats[] | []>(
        `${URL}/api/web/teachers/${teacherId}/topic-stats/per-section`,
        "Failed to fetch topic stats per section.",
      );
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!teacherId,
  });
};
