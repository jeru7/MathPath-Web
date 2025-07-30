import { URL } from "../../core/constants/api.constant";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../core/utils/api/api.util";
import { QuestionStats, TopicStats } from "../../core/types/chart.type";
import {
  DifficultyFrequency,
  PlayerCard,
  StudentAttemptStats,
} from "../types/student-stats.type";

// get student stats on attempt
export const useStudentAttemptStats = (studentId: string) => {
  return useQuery<StudentAttemptStats>({
    queryKey: ["student", studentId, "attempt-stats"],
    queryFn: () => {
      return fetchData<StudentAttemptStats>(
        `${URL}/api/web/students/${studentId}/stats/attempts`,
        "Failed to fetch student attempt stats",
      );
    },
    enabled: !!studentId,
  });
};

// get student chosen difficulty frequency stats
export const useStudentDifficultyFrequency = (studentId: string) => {
  return useQuery<DifficultyFrequency>({
    queryKey: ["student", studentId, "difficulty-frequency"],
    queryFn: () => {
      return fetchData<DifficultyFrequency>(
        `${URL}/api/web/students/${studentId}/stats/difficulty-frequency`,
        "Failed to fetch student chosen difficulty frequency stats.",
      );
    },
    enabled: !!studentId,
  });
};

// get student player card stats
export const useStudentPlayerCard = (studentId: string) => {
  return useQuery<PlayerCard>({
    queryKey: ["student", studentId, "player-card"],
    queryFn: () => {
      return fetchData<PlayerCard>(
        `${URL}/api/web/students/${studentId}/stats/player-card`,
        "Failed to fetch student player card stats.",
      );
    },
    enabled: !!studentId,
  });
};

export const useStudentTopicStats = (studentId: string) => {
  return useQuery<TopicStats[] | []>({
    queryKey: ["student", studentId, "topic-stats"],
    queryFn: () => {
      return fetchData<TopicStats[] | []>(
        `${URL}/api/web/students/${studentId}/stats/topics`,
        "Failed to fetch student topic stats.",
      );
    },
    enabled: !!studentId,
  });
};

export const useStudentQuestionStats = (studentId: string) => {
  return useQuery<QuestionStats[] | []>({
    queryKey: ["student", studentId, "question-stats"],
    queryFn: () => {
      return fetchData<QuestionStats[] | []>(
        `${URL}/api/web/students/${studentId}/stats/questions`,
        "Failed to fetch student question stats.",
      );
    },
    enabled: !!studentId,
  });
};
