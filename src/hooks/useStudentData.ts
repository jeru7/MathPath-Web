import { useQuery } from "@tanstack/react-query";
import { IQuestionStats, ITopicStats } from "../types/chart.type";
import {
  getStudentQuestionStats,
  getStudentTopicStats,
} from "../services/chart.service";

export const useStudentTopicStats = (studentId: string) => {
  return useQuery<ITopicStats[]>({
    queryKey: ["student", studentId, "topic-stats"],
    queryFn: () => getStudentTopicStats(studentId),
    enabled: !!studentId,
  });
};

export const useStudentQuestionStats = (studentId: string) => {
  return useQuery<IQuestionStats[]>({
    queryKey: ["student", studentId, "question-stats"],
    queryFn: () => getStudentQuestionStats(studentId),
    enabled: !!studentId,
  });
};
