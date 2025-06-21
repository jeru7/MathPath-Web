import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { QuestionStats, TopicStats } from "../types/chart.types";
import * as chartService from "../services/chart.service";
import * as studentService from "../services/student/student.service";
import * as studentType from "../types/student/student.types";
import * as progressCardType from "../types/progress_card.types";
import { ProgressLog } from "../types/progress_log/progress_log.types";
import { StudentContext } from "../context/StudentContext";
import { StageAttempt } from "../types/stage_attempt/stage_attempt.types";
import {
  DifficultyFrequency,
  PlayerCard,
  StudentAttemptStats,
} from "../types/student/student_stats.types";
import { QuestList } from "../types/quest/quest.types";

export function useStudentContext() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error(
      "useStudentContext must be used only within the StudentProvider.",
    );
  }
  return context;
}
export const useStudentData = (studentId: string) => {
  return useQuery<studentType.Student>({
    queryKey: ["student", studentId, "student-data"],
    queryFn: () => studentService.getStudent(studentId),
    enabled: !!studentId,
  });
};

// get studet attempts
export const useStudentAttempts = (studentId: string) => {
  return useQuery<StageAttempt[]>({
    queryKey: ["student", studentId, "attempts"],
    queryFn: () => studentService.getStudentAttempts(studentId),
    enabled: !!studentId,
  });
};

// get student stats on topic
export const useStudentTopicStats = (studentId: string) => {
  return useQuery<TopicStats[]>({
    queryKey: ["student", studentId, "topic-stats"],
    queryFn: () => chartService.getStudentTopicStats(studentId),
    enabled: !!studentId,
  });
};

// get student stats on question
export const useStudentQuestionStats = (studentId: string) => {
  return useQuery<QuestionStats[]>({
    queryKey: ["student", studentId, "question-stats"],
    queryFn: () => chartService.getStudentQuestionStats(studentId),
    enabled: !!studentId,
  });
};

// get student stats on attempt
export const useStudentAttemptStats = (studentId: string) => {
  return useQuery<StudentAttemptStats>({
    queryKey: ["student", studentId, "attempt-stats"],
    queryFn: () => studentService.getStudentAttemptStats(studentId),
    enabled: !!studentId,
  });
};

// get student chosen difficulty frequency stats
export const useStudentDifficultyFrequency = (studentId: string) => {
  return useQuery<DifficultyFrequency>({
    queryKey: ["student", studentId, "difficulty-frequency"],
    queryFn: () => studentService.getStudentDifficultyFrequency(studentId),
    enabled: !!studentId,
  });
};

// get student progress log
export const useStudentProgressLog = (studentId: string) => {
  return useQuery<ProgressLog[]>({
    queryKey: ["student", studentId, "progress-log"],
    queryFn: () => studentService.getStudentProgressLogService(studentId),
    enabled: !!studentId,
  });
};

// get student player card stats
export const useStudentPlayerCard = (studentId: string) => {
  return useQuery<PlayerCard>({
    queryKey: ["student", studentId, "player-card"],
    queryFn: () => studentService.getStudentPlayerCardStatsService(studentId),
    enabled: !!studentId,
  });
};

// get student student quest list
export const useStudentQuestList = (studentId: string) => {
  return useQuery<QuestList>({
    queryKey: ["student", studentId, "quest-list"],
    queryFn: () => studentService.getStudentQuestListService(studentId),
    enabled: !!studentId,
  });
};

// get student assessment tracker
export const useStudentAssessmentTracker = (studentId: string) => {
  return useQuery<progressCardType.AssessmentTracker>({
    queryKey: ["student", studentId, "assessment-tracker"],
    queryFn: () => studentService.getAssessmentTrackerService(studentId),
    enabled: !!studentId,
  });
};

// get student stages tracker
export const useStudentStagesTracker = (studentId: string) => {
  return useQuery<progressCardType.StagesTracker>({
    queryKey: ["student", studentId, "stages-tracker"],
    queryFn: () => studentService.getStagesTrackerService(studentId),
    enabled: !!studentId,
  });
};
