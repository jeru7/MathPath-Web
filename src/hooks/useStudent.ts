import { useQuery } from "@tanstack/react-query";
import { IQuestionStats, ITopicStats } from "../types/chart.type";
import {
  getStudentQuestionStats,
  getStudentTopicStats,
} from "../services/chart.service";
import {
  getStudent,
  getStudentAttempts,
  getStudentAttemptStats,
  getStudentDifficultyFrequency,
  getStudentProgressLogService,
} from "../services/student.service";
import {
  IDifficultyFrequency,
  IStudent,
  IStudentAttempt,
  IStudentAttemptStats,
} from "../types/student.type";
import { IProgressLog } from "../types/progress-log.type";

export const useStudentData = (studentId: string) => {
  return useQuery<IStudent>({
    queryKey: ["student", studentId, "student-data"],
    queryFn: () => getStudent(studentId),
    enabled: !!studentId,
  });
};

export const useStudentAttempts = (studentId: string) => {
  return useQuery<IStudentAttempt[]>({
    queryKey: ["student", studentId, "attempts"],
    queryFn: () => getStudentAttempts(studentId),
    enabled: !!studentId,
  });
};

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

export const useStudentAttemptStats = (studentId: string) => {
  return useQuery<IStudentAttemptStats>({
    queryKey: ["student", studentId, "attempt-stats"],
    queryFn: () => getStudentAttemptStats(studentId),
    enabled: !!studentId,
  });
};

export const useStudentDifficultyFrequency = (studentId: string) => {
  return useQuery<IDifficultyFrequency>({
    queryKey: ["student", studentId, "difficulty-frequency"],
    queryFn: () => getStudentDifficultyFrequency(studentId),
    enabled: !!studentId,
  });
};

export const useStudentProgressLog = (studentId: string) => {
  return useQuery<IProgressLog[]>({
    queryKey: ["student", studentId, "progress-log"],
    queryFn: () => getStudentProgressLogService(studentId),
    enabled: !!studentId,
  });
};
