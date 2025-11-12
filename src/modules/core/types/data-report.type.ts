export type StudentData = {
  lrn: string;
  fullName: string;
  sectionName: string;
  assessmentsTaken: number;
  assessmentsPassed: number;
  assessmentsPassingRate: number;
  stageAttempts: number;
  currentStage: string;
  averageAnswerCorrectness: number;
  winRate: number;
  areaOfDifficulty: string;
};

export type AssessmentData = {
  assessmentTitle: string;
  topic: string;
  score: number;
  averageScore: number;
  averageTimeTaken: number;
  passingRate: number;
  totalAttempts: number;
};

export type AssessmentAttemptData = {
  studentName: string;
  assessmentTitle: string;
  score: number;
  timeTaken: number;
  dateCompleted: string;
  result: string;
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

export type PreviewDataItem =
  | StudentData
  | AssessmentData
  | AssessmentAttemptData
  | StageData;
