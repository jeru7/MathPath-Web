export type AssessmentAttempt = {
  id: string;
  studentId: string;
  assessmentId: string;
  score: number;
  timeSpent: number;
  status: "in-progress" | "completed" | "paused" | "abandoned";
  dateStarted: string;
  dateCompleted?: string;
  dateUpdated: string;
  currentPage?: number;
  percentage: number;
};
