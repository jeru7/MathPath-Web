// topic stats
// used for section topic stats
export interface ISectionTopicResponse {
  success: string;
  message: string;
  data: ISectionTopicStats[];
}

export interface ISectionTopicStats {
  sectionId: string;
  sectionName: string;
  topicStats: ITopicStats[];
}

// can be used for student and overall
export interface IStudentTopicResponse {
  success: string;
  message: string;
  data: ITopicStats[];
}

export interface ITopicStats {
  totalAttempts: number;
  topic: string;
  level: number;
  avgSecondsPlayed: number;
  avgHintUsed: number;
  completionRate: number;
  correctness: ICorrectness;
}

export interface ICorrectness {
  easy: {
    correctPercentage: number;
  };
  medium: {
    correctPercentage: number;
  };
  hard: {
    correctPercentage: number;
  };
}

// question stats
export interface IQuestionStats {
  question: string;
  difficulty: DifficultyType;
  totalAttempts: number;
  correctCount: number;
  gameLevel: number;
  correctnessPercentage: number;
}

export interface IQuestionAttempt {
  question: string;
  selectedAnswer: string;
  isCorrect: boolean;
  difficulty: DifficultyType;
  hintUsed: boolean;
}

export type DifficultyType = "easy" | "medium" | "hard";
