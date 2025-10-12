import { createContext, useContext } from "react";
import { Assessment } from "../../types/assessment/assessment.type";
import {
  StudentAnswer,
  StudentAnswers,
} from "../../types/assessment-attempt/assessment-attempt.type";

export type PreviewMode = "preview" | "assessment";

type PreviewContextType = {
  isOpen: boolean;
  mode: PreviewMode;
  currentAssessment: Assessment | null;
  openPreview: (assessment: Assessment, mode?: PreviewMode) => void;
  closePreview: () => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  studentAnswers: StudentAnswers;
  setStudentAnswer: (questionId: string, answer: StudentAnswer) => void;
  resetAnswers: () => void;
  onSubmitAssessment?: (answers: StudentAnswers) => void;
  setOnSubmitAssessment: (handler: (answers: StudentAnswers) => void) => void;
};

export const PreviewContext = createContext<PreviewContextType | undefined>(
  undefined,
);

export const usePreview = () => {
  const context = useContext(PreviewContext);
  if (context === undefined) {
    throw new Error("usePreview must be used within a PreviewProvider");
  }
  return context;
};
