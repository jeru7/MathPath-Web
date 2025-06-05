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
  getStudentPlayerCardStatsService,
  getStudentProgressLogService,
  getStudentQuestListService,
} from "../services/student/student.service";
import {
  IDifficultyFrequency,
  IPlayerCard,
  IStudent,
  IStudentAttempt,
  IStudentAttemptStats,
  IStudentQuestList,
} from "../types/student.type";
import { IProgressLog } from "../types/progress-log.type";
import { StudentContext } from "../context/StudentContext";
import { useContext } from "react";

// context
export function useStudentContext() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error(
      "useStudentContext must be used only within the StudentProvider.",
    );
  }
  return context;
}

// react queries
// get student data
export const useStudentData = (studentId: string) => {
  return useQuery<IStudent>({
    queryKey: ["student", studentId, "student-data"],
    queryFn: () => getStudent(studentId),
    enabled: !!studentId,
  });
};

// get studet attempts
export const useStudentAttempts = (studentId: string) => {
  return useQuery<IStudentAttempt[]>({
    queryKey: ["student", studentId, "attempts"],
    queryFn: () => getStudentAttempts(studentId),
    enabled: !!studentId,
  });
};

// get student stats on topic
export const useStudentTopicStats = (studentId: string) => {
  return useQuery<ITopicStats[]>({
    queryKey: ["student", studentId, "topic-stats"],
    queryFn: () => getStudentTopicStats(studentId),
    enabled: !!studentId,
  });
};

// get student stats on question
export const useStudentQuestionStats = (studentId: string) => {
  return useQuery<IQuestionStats[]>({
    queryKey: ["student", studentId, "question-stats"],
    queryFn: () => getStudentQuestionStats(studentId),
    enabled: !!studentId,
  });
};

// get student stats on attempt
export const useStudentAttemptStats = (studentId: string) => {
  return useQuery<IStudentAttemptStats>({
    queryKey: ["student", studentId, "attempt-stats"],
    queryFn: () => getStudentAttemptStats(studentId),
    enabled: !!studentId,
  });
};

// get student chosen difficulty frequency stats
export const useStudentDifficultyFrequency = (studentId: string) => {
  return useQuery<IDifficultyFrequency>({
    queryKey: ["student", studentId, "difficulty-frequency"],
    queryFn: () => getStudentDifficultyFrequency(studentId),
    enabled: !!studentId,
  });
};

// get student progress log
export const useStudentProgressLog = (studentId: string) => {
  return useQuery<IProgressLog[]>({
    queryKey: ["student", studentId, "progress-log"],
    queryFn: () => getStudentProgressLogService(studentId),
    enabled: !!studentId,
  });
};

// get student player card stats
export const useStudentPlayerCard = (studentId: string) => {
  return useQuery<IPlayerCard>({
    queryKey: ["student", studentId, "player-card"],
    queryFn: () => getStudentPlayerCardStatsService(studentId),
    enabled: !!studentId,
  });
};

// get student player card stats
export const useStudentQuestList = (studentId: string) => {
  return useQuery<IStudentQuestList>({
    queryKey: ["student", studentId, "quest-list"],
    queryFn: () => getStudentQuestListService(studentId),
    enabled: !!studentId,
  });
};
