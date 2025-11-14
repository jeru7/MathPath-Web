import { createContext, useContext } from "react";
import { Assessment } from "../../types/assessment/assessment.type";
import { StudentAnswers } from "../../types/assessment-attempt/assessment-attempt.type";

export type PreviewMode = "preview" | "assessment";

export interface PreviewContextType {
  isOpen: boolean;
  mode: PreviewMode;
  currentAssessment: Assessment | null;
  currentPage: number;
  studentAnswers: StudentAnswers;
  openPreview: (assessment: Assessment, mode?: PreviewMode) => void;
  closePreview: () => void;
  setCurrentPage: (page: number) => void;
  setStudentAnswer: (
    questionId: string,
    answer: string | string[] | Record<string, string> | boolean,
  ) => void;
  resetAnswers: () => void;
  onSubmitAssessment?: (answers: StudentAnswers) => void;
  setOnSubmitAssessment: (handler: (answers: StudentAnswers) => void) => void;
}

export const PreviewContext = createContext<PreviewContextType>({
  isOpen: false,
  mode: "preview",
  currentAssessment: null,
  currentPage: 0,
  studentAnswers: [],
  openPreview: () => { },
  closePreview: () => { },
  setCurrentPage: () => { },
  setStudentAnswer: () => { },
  resetAnswers: () => { },
  setOnSubmitAssessment: () => { },
});

export const usePreview = () => useContext(PreviewContext);
