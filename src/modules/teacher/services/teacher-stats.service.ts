import { useQuery } from "@tanstack/react-query";
import { SectionTopicStats, TopicStats } from "../../core/types/chart.type";
import { DATA_STALE_TIME, URL } from "../../core/constants/api.constant";
import { fetchData } from "../../core/utils/api/api.util";
import { ActiveStudents } from "../types/active-student.type";
import { TopicHighlights } from "../types/topic-highlights.type";
import { AssessmentStatus } from "../types/assessment-status.type";
import {
  OnlineTrendRange,
  OnlineTrendResultDay,
  OnlineTrendResultToday,
} from "../types/student-online-trend.type";

// get overall topic stats - all students handled by the teacher
export const useTeacherOverallTopicStats = (teacherId: string) => {
  return useQuery<TopicStats[]>({
    queryKey: ["teacher", teacherId, "overall-topic-stats"],
    queryFn: () => {
      return fetchData<TopicStats[]>(
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
  return useQuery<SectionTopicStats[]>({
    queryKey: ["teacher", teacherId, "section-topic-stats"],
    queryFn: () => {
      return fetchData<SectionTopicStats[]>(
        `${URL}/api/web/teachers/${teacherId}/topic-stats/per-section`,
        "Failed to fetch topic stats per section.",
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
        `${URL}/api/web/teachers/${teacherId}/stats/online-trend?range=${range}`,
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
        `${URL}/api/web/teachers/${teacherId}/stats/active-students`,
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
        `${URL}/api/web/teachers/${teacherId}/stats/topic-highlights`,
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
        `${URL}/api/web/teachers/${teacherId}/stats/assessment-status`,
        "Failed to fetch assessment status.",
      );
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!teacherId,
  });
};
