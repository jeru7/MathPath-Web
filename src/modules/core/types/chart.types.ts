import { QuestionDifficulty } from "./stage_attempt/stage_attempt.types";

export type SectionTopicResponse = {
  success: string;
  message: string;
  data: SectionTopicStats[];
};

export type SectionTopicStats = {
  sectionId: string;
  sectionName: string;
  topicStats: TopicStats[];
};

export type StudentTopicResponse = {
  success: string;
  message: string;
  data: TopicStats[];
};

export type TopicStats = {
  totalAttempts: number;
  topic: string;
  stage: number;
  avgSecondsPlayed: number;
  avgHintUsed: number;
  completionRate: number;
  correctness: TopicCorrectness;
};

export type TopicCorrectness = {
  easy: {
    correctPercentage: number;
  };
  medium: {
    correctPercentage: number;
  };
  hard: {
    correctPercentage: number;
  };
};

export type QuestionStats = {
  question: string;
  difficulty: QuestionDifficulty;
  totalAttempts: number;
  correctCount: number;
  stage: number;
  correctnessPercentage: number;
};

export type QuestionAttempt = {
  question: string;
  selectedAnswer: string;
  isCorrect: boolean;
  difficulty: QuestionDifficulty;
  hintUsed: boolean;
};
