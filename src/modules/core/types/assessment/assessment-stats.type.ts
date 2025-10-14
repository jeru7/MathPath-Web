export type AssessmentStatus =
  | "draft"
  | "published"
  | "in-progress"
  | "finished";

export type AssessmentOverview = {
  overview: {
    totalAssessments: number;
    totalAttempts: number;
    averageScore: number;
    completionRate: number;
    passRate: number;
    averageTimeSpent: number;
  };
  trendData: TrendDataItem[];
  assessments: AssessmentListItem[];
};

export type TrendDataItem = {
  date: string;
  value: number;
  label: string;
};

export type AssessmentListItem = {
  id: string;
  title: string;
  status: AssessmentStatus;
  totalAttempts: number;
  averageScore: number;
  completionRate: number;
  passRate: number;
  averageTimeSpent: number;
};
