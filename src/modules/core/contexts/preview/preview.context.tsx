import { createContext, useContext } from "react";
import { Assessment } from "../../types/assessment/assessment.type";

export type PreviewMode = "preview" | "assessment";

export type StudentAnswer = string | string[] | Record<string, string>;

export type StudentAnswers = Record<string, StudentAnswer>;

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
