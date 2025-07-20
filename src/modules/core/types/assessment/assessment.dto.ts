import { AssessmentPage } from "./assessment.type";

export type CreateAssessmentDTO = {
  title: string | null;
  topic: string | null;
  description: string | null;
  teacher: string;
  sections: string[] | [];
  pages: AssessmentPage[] | [];
  passingScore: number;
  attemptLimit: number;
  date: {
    start: Date | null;
    end: Date | null;
  };
  timeLimit: number;
};
