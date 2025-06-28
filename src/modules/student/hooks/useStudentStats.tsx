import { useQuery } from "@tanstack/react-query";
import {
  DifficultyFrequency,
  PlayerCard,
  StudentAttemptStats,
} from "../../core/types/student/student_stats.types";
import * as studentService from "../services/studentStats.service";
import { QuestList } from "../../core/types/quest/quest.types";
import {
  AssessmentTracker,
  StagesTracker,
} from "../../core/types/progress_card.types";
import { QuestionStats, TopicStats } from "../../core/types/chart.types";

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

// get student player card stats
export const useStudentPlayerCard = (studentId: string) => {
  return useQuery<PlayerCard>({
    queryKey: ["student", studentId, "player-card"],
    queryFn: () => studentService.getStudentPlayerCardStats(studentId),
    enabled: !!studentId,
  });
};

// get student student quest list
export const useStudentQuestList = (studentId: string) => {
  return useQuery<QuestList>({
    queryKey: ["student", studentId, "quest-list"],
    queryFn: () => studentService.getStudentQuestList(studentId),
    enabled: !!studentId,
  });
};

// get student assessment tracker
export const useStudentAssessmentTracker = (studentId: string) => {
  return useQuery<AssessmentTracker>({
    queryKey: ["student", studentId, "assessment-tracker"],
    queryFn: () => studentService.getAssessmentTracker(studentId),
    enabled: !!studentId,
  });
};

// get student stages tracker
export const useStudentStagesTracker = (studentId: string) => {
  return useQuery<StagesTracker>({
    queryKey: ["student", studentId, "stages-tracker"],
    queryFn: () => studentService.getStagesTracker(studentId),
    enabled: !!studentId,
  });
};

// get student stats on topic
export const useStudentTopicStats = (studentId: string) => {
  return useQuery<TopicStats[]>({
    queryKey: ["student", studentId, "topic-stats"],
    queryFn: () => studentService.getStudentTopicStats(studentId),
    enabled: !!studentId,
  });
};

// get student stats on question
export const useStudentQuestionStats = (studentId: string) => {
  return useQuery<QuestionStats[]>({
    queryKey: ["student", studentId, "question-stats"],
    queryFn: () => studentService.getStudentQuestionStats(studentId),
    enabled: !!studentId,
  });
};
