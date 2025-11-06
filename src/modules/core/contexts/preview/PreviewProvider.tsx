import { useState, ReactNode } from "react";
import { Assessment } from "../../types/assessment/assessment.type";
import { PreviewContext, PreviewMode } from "./preview.context";
import { StudentAnswers } from "../../types/assessment-attempt/assessment-attempt.type";

export function PreviewProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<PreviewMode>("preview");
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState<StudentAnswers>([]);
  const [onSubmitAssessment, setOnSubmitAssessment] =
    useState<(answers: StudentAnswers) => void>();

  const openPreview = (
    assessment: Assessment,
    mode: PreviewMode = "preview",
  ) => {
    setCurrentAssessment(assessment);
    setMode(mode);
    setIsOpen(true);
    setCurrentPage(0);
    if (mode === "assessment") {
      resetAnswers();
    }
  };

  const closePreview = () => {
    setIsOpen(false);
    setCurrentAssessment(null);
    setCurrentPage(0);
    if (mode === "assessment") {
      resetAnswers();
    }
  };

  const setStudentAnswer = (
    questionId: string,
    answer: string | string[] | Record<string, string> | boolean,
  ) => {
    setStudentAnswers((prev) => {
      const existingAnswerIndex = prev.findIndex(
        (item) => item.questionId === questionId,
      );

      if (existingAnswerIndex >= 0) {
        const updatedAnswers = [...prev];
        updatedAnswers[existingAnswerIndex] = {
          questionId,
          answer,
        };
        return updatedAnswers;
      } else {
        return [
          ...prev,
          {
            questionId,
            answer,
          },
        ];
      }
    });
  };

  const resetAnswers = () => {
    setStudentAnswers([]);
  };

  const handleSetOnSubmitAssessment = (
    handler: (answers: StudentAnswers) => void,
  ) => {
    setOnSubmitAssessment(() => handler);
  };

  return (
    <PreviewContext.Provider
      value={{
        isOpen,
        mode,
        currentAssessment,
        openPreview,
        closePreview,
        currentPage,
        setCurrentPage,
        studentAnswers,
        setStudentAnswer,
        resetAnswers,
        onSubmitAssessment,
        setOnSubmitAssessment: handleSetOnSubmitAssessment,
      }}
    >
      {children}
    </PreviewContext.Provider>
  );
}
