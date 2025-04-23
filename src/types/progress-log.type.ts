export interface IProgressLog {
  studentId: string;
  date: string;
  gameLevelsPlayed: number;
  secondsPlayed: number;
  completedQuest: string[];
  currentLevel: number;
  totalExp: number;
  totalCoins: number;
  totalWins: number;
  winRate: number;
  answerCorrectness: IAnswerCorrectness;
  createdAt: Date;
  updatedAt: Date;
}

interface IAnswerCorrectness {
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
