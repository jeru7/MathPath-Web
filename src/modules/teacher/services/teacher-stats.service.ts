import { useQuery } from "@tanstack/react-query";
import {
  QuestionStatsResponse,
  TopicStatsResponse,
} from "../../core/types/chart.type";
import { BASE_URI, DATA_STALE_TIME } from "../../core/constants/api.constant";
import { fetchData } from "../../core/utils/api/api.util";
import { ActiveStudents } from "../types/active-student.type";
import { TopicHighlights } from "../types/topic-highlights.type";
import { AssessmentStatus } from "../types/assessment-status.type";
import {
  OnlineTrendRange,
  OnlineTrendResultDay,
  OnlineTrendResultToday,
} from "../types/student-online-trend.type";
import { AssessmentOverview } from "../../core/types/assessment/assessment-stats.type";
import { TopStudent } from "@/modules/student/types/top-student.type";
import { TopicPredictionResponse } from "@/modules/core/types/analytics/topic-prediction.type";

// get topic stats
export const useTeacherTopicStats = (teacherId: string) => {
  return useQuery<TopicStatsResponse>({
    queryKey: ["teacher", teacherId, "topic-stats"],
    queryFn: () => {
      return fetchData<TopicStatsResponse>(
        `${BASE_URI}/api/web/teachers/${teacherId}/stats/topics`,
        "Failed to fetch topic stats.",
      );
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!teacherId,
  });
};

// get topic prediction
export const useTeacherTopicPredictions = (teacherId: string) => {
  return useQuery<TopicPredictionResponse>({
    queryKey: ["teacher", teacherId, "topic-prediction"],
    queryFn: () => {
      return fetchData<TopicPredictionResponse>(
        `${BASE_URI}/api/web/teachers/${teacherId}/stats/topics/predictions`,
        "Failed to fetch topic prediction.",
      );
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!teacherId,
  });
};

// get overall activity trend
export const useTeacherOnlineTrend = (
  teacherId: string,
  range: OnlineTrendRange,
) => {
  return useQuery<OnlineTrendResultDay[] | OnlineTrendResultToday[] | null>({
    queryKey: ["teacher", teacherId, "online-trend", range],
    queryFn: () => {
      return fetchData<
        OnlineTrendResultDay[] | OnlineTrendResultToday[] | null
      >(
        `${BASE_URI}/api/web/teachers/${teacherId}/stats/online-trend?range=${range}`,
        "Failed to fetch online trend.",
      );
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!teacherId,
  });
};

// get active student stats
export const useTeacherActiveStudent = (teacherId: string) => {
  return useQuery<ActiveStudents>({
    queryKey: ["teacher", teacherId, "active-students"],
    queryFn: () => {
      return fetchData<ActiveStudents>(
        `${BASE_URI}/api/web/teachers/${teacherId}/stats/active-students`,
        "Failed to fetch activity trend.",
      );
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!teacherId,
  });
};

// get topic highlights stats
export const useTeacherTopicHighlights = (teacherId: string) => {
  return useQuery<TopicHighlights>({
    queryKey: ["teacher", teacherId, "topic-highlights"],
    queryFn: () => {
      return fetchData<TopicHighlights>(
        `${BASE_URI}/api/web/teachers/${teacherId}/stats/topic-highlights`,
        "Failed to fetch topic highlights.",
      );
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!teacherId,
  });
};

// get assessment status stats
export const useTeacherAssessmentStatus = (teacherId: string) => {
  return useQuery<AssessmentStatus[]>({
    queryKey: ["teacher", teacherId, "assessment-status"],
    queryFn: () => {
      return fetchData<AssessmentStatus[]>(
        `${BASE_URI}/api/web/teachers/${teacherId}/stats/assessment-status`,
        "Failed to fetch assessment status.",
      );
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!teacherId,
  });
};

// get question stats
export const useTeacherQuestionStats = (teacherId: string) => {
  return useQuery<QuestionStatsResponse>({
    queryKey: ["teacher", teacherId, "question-stats"],
    queryFn: () => {
      return fetchData<QuestionStatsResponse>(
        `${BASE_URI}/api/web/teachers/${teacherId}/stats/questions`,
        "Failed to fetch question stats.",
      );
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!teacherId,
  });
};

// get assessment overview stats
export const useTeacherAssessmentOverview = (teacherId: string) => {
  return useQuery<AssessmentOverview>({
    queryKey: ["teacher", teacherId, "assessment-overview"],
    queryFn: () => {
      return fetchData<AssessmentOverview>(
        `${BASE_URI}/api/web/teachers/${teacherId}/stats/assessment-overview`,
        "Failed to fetch assessment overview.",
      );
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!teacherId,
  });
};

// get top students
export const useTeacherTopStudents = (teacherId: string) => {
  return useQuery<TopStudent[]>({
    queryKey: ["teacher", teacherId, "top-students"],
    queryFn: () => {
      return fetchData<TopStudent[]>(
        `${BASE_URI}/api/web/teachers/${teacherId}/stats/top-students`,
        "Failed to fetch top students.",
      );
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!teacherId,
  });
};
