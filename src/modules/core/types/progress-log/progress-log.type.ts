export type ProgressLog = {
  studentId: string;
  date: string;
  stagesPlayed: number;
  secondsPlayed: number;
  completedQuest: string[];
  currentLevel: number;
  totalExpGained: number;
  totalCoinsGained: number;
  totalStageWins: number;
  winRate: number;
  answerCorrectness: AnswerCorrectness;
};

export interface AnswerCorrectness {
  easy: {
    correctAnswers: number;
    attempts: number;
  };
  medium: {
    correctAnswers: number;
    attempts: number;
  };
  hard: {
    correctAnswers: number;
    attempts: number;
  };
}
