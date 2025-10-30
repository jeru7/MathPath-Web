export type StudentData = {
  lrn: string;
  fullName: string;
  sectionName: string;
  totalAssessmentsTaken: number;
  totalStageAttempts: number;
  currentStage: number;
  overallAverageCorrectness: number;
  overallAssessmentScorePercentage: number;
  dateCreated: string;
  areaOfDifficulty: string;
};

export type AssessmentData = {
  title: string;
  topic: string;
  averageScorePercentage: number;
  averageTimeTaken: number;
  totalAttemptsTaken: number;
};

export type StageData = {
  stage: number;
  topic: string;
  averageCorrectness: number;
  totalStageAttempts: number;
  averageTimeTaken: number;
  winRate: number;
  easy: number;
  medium: number;
  hard: number;
};
