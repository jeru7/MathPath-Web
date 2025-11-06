export type StudentAnswer = {
  questionId: string;
  answer: string | string[] | Record<string, string> | boolean;
};

export type StudentAnswers = StudentAnswer[];

export type AssessmentAttempt = {
  id?: string;
  studentId: string;
  assessmentId: string;
  answers: StudentAnswer[];
  score: number;
  timeSpent: number;
  status: "completed" | "paused" | "abandoned" | "failed";
  dateStarted: string;
  dateCompleted?: string;
  dateUpdated: string;
};
