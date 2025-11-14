import { useState, ReactNode, useCallback, useEffect } from "react";
import { PreviewContext, PreviewMode } from "./preview.context";
import { Assessment } from "../../types/assessment/assessment.type";
import { StudentAnswers } from "../../types/assessment-attempt/assessment-attempt.type";

const STORAGE_KEYS = {
  STUDENT_ANSWERS: "student_answers",
  ASSESSMENT_DATA: "assessment_data",
  CURRENT_PAGE: "current_page",
  MODE: "preview_mode",
  IS_OPEN: "preview_is_open",
};

const getStoredAnswers = (): StudentAnswers => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.STUDENT_ANSWERS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const getStoredAssessment = (): Assessment | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ASSESSMENT_DATA);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const getStoredPage = (): number => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_PAGE);
    return stored ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
};

const getStoredMode = (): PreviewMode => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.MODE);
    return (stored as PreviewMode) || "preview";
  } catch {
    return "preview";
  }
};

const getStoredIsOpen = (): boolean => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.IS_OPEN);
    return stored === "true";
  } catch {
    return false;
  }
};

export function PreviewProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(getStoredIsOpen);
  const [mode, setMode] = useState<PreviewMode>(getStoredMode);
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(
    getStoredAssessment,
  );
  const [currentPage, setCurrentPage] = useState(getStoredPage);
  const [studentAnswers, setStudentAnswers] =
    useState<StudentAnswers>(getStoredAnswers);
  const [onSubmitAssessment, setOnSubmitAssessment] =
    useState<(answers: StudentAnswers) => void>();

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.STUDENT_ANSWERS,
      JSON.stringify(studentAnswers),
    );
  }, [studentAnswers]);

  useEffect(() => {
    if (currentAssessment) {
      localStorage.setItem(
        STORAGE_KEYS.ASSESSMENT_DATA,
        JSON.stringify(currentAssessment),
      );
    } else {
      localStorage.removeItem(STORAGE_KEYS.ASSESSMENT_DATA);
    }
  }, [currentAssessment]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PAGE, currentPage.toString());
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MODE, mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IS_OPEN, isOpen.toString());
  }, [isOpen]);

  const clearStorage = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.STUDENT_ANSWERS);
    localStorage.removeItem(STORAGE_KEYS.ASSESSMENT_DATA);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_PAGE);
    localStorage.removeItem(STORAGE_KEYS.MODE);
    localStorage.removeItem(STORAGE_KEYS.IS_OPEN);
  }, []);

  const resetAnswers = useCallback(() => {
    setStudentAnswers([]);
    localStorage.removeItem(STORAGE_KEYS.STUDENT_ANSWERS);
  }, []);

  const openPreview = useCallback(
    (assessment: Assessment, newMode: PreviewMode = "preview") => {
      setCurrentAssessment(assessment);
      setMode(newMode);
      setIsOpen(true);
      setCurrentPage(0);
      setStudentAnswers([]);
    },
    [],
  );

  const closePreview = useCallback(() => {
    setIsOpen(false);
    setCurrentAssessment(null);
    setCurrentPage(0);
    setStudentAnswers([]);
    clearStorage();
  }, [clearStorage]);

  const setStudentAnswer = useCallback(
    (
      questionId: string,
      answer: string | string[] | Record<string, string> | boolean,
    ) => {
      setStudentAnswers((prev) => {
        const index = prev.findIndex((x) => x.questionId === questionId);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = { questionId, answer };
          return updated;
        }
        return [...prev, { questionId, answer }];
      });
    },
    [],
  );

  const handleSetOnSubmitAssessment = useCallback(
    (handler: (answers: StudentAnswers) => void) => {
      setOnSubmitAssessment(() => handler);
    },
    [],
  );

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
