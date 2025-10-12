export type StudentAnswer = string | string[] | Record<string, string>;

export type StudentAnswers = Record<string, StudentAnswer>;

export type AssessmentAttempt = {
  id?: string;
  studentId: string;
  assessmentId: string;
  answers: Record<string, StudentAnswer>;
  score: number;
  timeSpent: number;
  status: "completed" | "paused" | "abandoned" | "failed";
  dateStarted: string;
  dateCompleted?: string;
  dateUpdated: string;
  currentPage?: number;
  percentage: number;
};
