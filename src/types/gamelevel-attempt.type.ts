import { IAnswerCorrectness } from "./progress-log.type";

export interface IGameLevelAttempt extends Document {
  studentId: string;
  gameLevelId: string;
  secondsPlayed: number;
  dateTaken: Date;
  fled?: boolean;
  died?: boolean;
  completed?: boolean;
  questionAttempts: IQuestionAttempt[];
  answerCorrectness?: IAnswerCorrectness;
  hintUsed: number;
  createdAt: Date;
  updatedAt: Date;
}

interface IQuestionAttempt {
  question: string;
  selectedAnswer: string;
  isCorrect: boolean;
  difficulty: "easy" | "medium" | "hard";
  hintUsed: boolean;
}
