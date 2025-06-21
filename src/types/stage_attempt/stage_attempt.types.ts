import { AnswerCorrectness } from "../progress_log/progress_log.types";

export type QuestionDifficulty = "Easy" | "Medium" | "Hard";

export type StageAttempt = {
  id: string;
  studentId: string;
  stageId: string;
  secondsPlayed: number;
  date: string;
  fled: boolean;
  died: boolean;
  completed: boolean;
  questionAttempts: StageQuestionAttempt[];
  answerCorrectness: AnswerCorrectness;
  hintUsed: number;
};

export type StageQuestionAttempt = {
  question: string;
  selectedAnswer: string;
  isCorrect: boolean;
  difficulty: QuestionDifficulty;
  hintUsed: boolean;
};
