export type TopStudent = {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  referenceNumber: string;
  sectionName: string;
  level: number;
  highestStage: number;
  winRate: number;
  performanceScore: number;
  totalQuestionsAttempted: number;
  totalCorrectAnswers: number;
  normalizedLevel?: number;
  normalizedStage?: number;
};
