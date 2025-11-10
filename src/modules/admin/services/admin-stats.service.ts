import {
  BASE_URI,
  DATA_STALE_TIME,
} from "@/modules/core/constants/api.constant";
import { AssessmentOverview } from "@/modules/core/types/assessment/assessment-stats.type";
import {
  QuestionStatsResponse,
  TopicStatsResponse,
} from "@/modules/core/types/chart.type";
import { fetchData } from "@/modules/core/utils/api/api.util";
import { TopStudent } from "@/modules/student/types/top-student.type";
import { ActiveStudents } from "@/modules/teacher/types/active-student.type";
import {
  OnlineTrendRange,
  OnlineTrendResultDay,
  OnlineTrendResultToday,
} from "@/modules/teacher/types/student-online-trend.type";
import { TopicHighlights } from "@/modules/teacher/types/topic-highlights.type";
import { useQuery } from "@tanstack/react-query";

// get overall activity trend
export const useAdminOnlineTrend = (
  adminId: string,
  range: OnlineTrendRange,
) => {
  return useQuery<OnlineTrendResultDay[] | OnlineTrendResultToday[] | null>({
    queryKey: ["admin", adminId, "online-trend", range],
    queryFn: () => {
      return fetchData<
        OnlineTrendResultDay[] | OnlineTrendResultToday[] | null
      >(
        `${BASE_URI}/api/web/admins/${adminId}/stats/online-trend?range=${range}`,
        "Failed to fetch online trend.",
      );
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!adminId,
  });
};

// get active student stats
export const useAdminActiveStudent = (adminId: string) => {
  return useQuery<ActiveStudents>({
    queryKey: ["admin", adminId, "active-students"],
    queryFn: () => {
      return fetchData<ActiveStudents>(
        `${BASE_URI}/api/web/admins/${adminId}/stats/active-students`,
        "Failed to fetch activity trend.",
      );
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!adminId,
  });
};

// get topic highlights stats
export const useAdminTopicHighlights = (adminId: string) => {
  return useQuery<TopicHighlights>({
    queryKey: ["admin", adminId, "topic-highlights"],
    queryFn: () => {
      return fetchData<TopicHighlights>(
        `${BASE_URI}/api/web/admins/${adminId}/stats/topic-highlights`,
        "Failed to fetch topic highlights.",
      );
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!adminId,
  });
};

// get top students
export const useAdminTopStudents = (adminId: string) => {
  return useQuery<TopStudent[]>({
    queryKey: ["admin", adminId, "top-students"],
    queryFn: () => {
      return fetchData<TopStudent[]>(
        `${BASE_URI}/api/web/admins/${adminId}/stats/top-students`,
        "Failed to fetch top students.",
      );
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!adminId,
  });
};

// get assessment overview stats
export const useAdminAssessmentOverview = (adminId: string) => {
  return useQuery<AssessmentOverview>({
    queryKey: ["admin", adminId, "assessment-overview"],
    queryFn: () => {
      return fetchData<AssessmentOverview>(
        `${BASE_URI}/api/web/admins/${adminId}/stats/assessment-overview`,
        "Failed to fetch assessment overview.",
      );
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!adminId,
  });
};

export const useAdminTopicStats = (adminId: string) => {
  return useQuery<TopicStatsResponse>({
    queryKey: ["admin", adminId, "topic-stats"],
    queryFn: () => {
      return fetchData<TopicStatsResponse>(
        `${BASE_URI}/api/web/admins/${adminId}/stats/topics`,
        "Failed to fetch topic stats.",
      );
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!adminId,
  });
};

// get question stats
export const useAdminQuestionStats = (adminId: string) => {
  return useQuery<QuestionStatsResponse>({
    queryKey: ["admin", adminId, "question-stats"],
    queryFn: () => {
      return fetchData<QuestionStatsResponse>(
        `${BASE_URI}/api/web/admins/${adminId}/stats/questions`,
        "Failed to fetch question stats.",
      );
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!adminId,
  });
};
