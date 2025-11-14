import {
  type ReactElement,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AssessmentContent from "./AssessmentContent";
import AssessmentNavigation from "./AssessmentNavigation";
import AssessmentHeader from "./AssessmentHeader";
import { FloatingCard } from "./modals/FloatingCard";
import ExitConfirmationModal from "./modals/ExitConfirmationModal";
import UnansweredQuestionsModal from "../UnansweredQuestionModal";
import { Assessment } from "../../../../../core/types/assessment/assessment.type";
import {
  AssessmentAttempt,
  StudentAnswers,
} from "../../../../../core/types/assessment-attempt/assessment-attempt.type";
import { usePreview } from "../../../../../core/contexts/preview/preview.context";
import {
  useSubmitAssessmentAttempt,
  useSavePausedAssessment,
} from "../../../../services/student-assessment-attempt.service";
import { APIErrorResponse } from "../../../../../core/types/api/api.type";
import { handleApiError } from "../../../../../core/utils/api/error.util";
import { FaInfoCircle } from "react-icons/fa";
import { Button } from "../../../../../../components/ui/button";

type StudentAssessmentProps = {
  assessment: Assessment;
  currentAttempt: AssessmentAttempt | null;
  onSubmitted?: (attempt: AssessmentAttempt) => void;
};

const TIMER_KEYS = {
  TIME_REMAINING: "time_remaining",
  SESSION_START: "session_start_time",
  INITIAL_TIME: "initial_time_remaining",
  HAS_SUBMITTED: "assessment_submitted",
};

const getStoredTimeRemaining = (defaultValue: number): number => {
  try {
    const stored = localStorage.getItem(TIMER_KEYS.TIME_REMAINING);
    return stored ? parseInt(stored, 10) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const getStoredSessionStart = (): number | null => {
  try {
    const stored = localStorage.getItem(TIMER_KEYS.SESSION_START);
    return stored ? parseInt(stored, 10) : null;
  } catch {
    return null;
  }
};

const getStoredHasSubmitted = (): boolean => {
  try {
    const stored = localStorage.getItem(TIMER_KEYS.HAS_SUBMITTED);
    return stored === "true";
  } catch {
    return false;
  }
};

const clearTimerStorage = () => {
  localStorage.removeItem(TIMER_KEYS.TIME_REMAINING);
  localStorage.removeItem(TIMER_KEYS.SESSION_START);
  localStorage.removeItem(TIMER_KEYS.INITIAL_TIME);
  localStorage.removeItem(TIMER_KEYS.HAS_SUBMITTED);
};

export default function StudentAssessment({
  assessment,
  currentAttempt,
  onSubmitted,
}: StudentAssessmentProps): ReactElement {
  const navigate = useNavigate();
  const { isOpen, mode, closePreview, studentAnswers, resetAnswers } =
    usePreview();

  const initialTimeRemaining = useMemo(() => {
    if (!assessment.timeLimit) return 0;

    const storedTime = getStoredTimeRemaining(-1);
    if (storedTime >= 0) {
      const totalTime = assessment.timeLimit * 60;
      if (storedTime <= totalTime) {
        return storedTime;
      }
    }

    const totalTime = assessment.timeLimit * 60;
    if (currentAttempt?.timeSpent && currentAttempt.timeSpent > 0) {
      return Math.max(totalTime - currentAttempt.timeSpent, 0);
    }
    return totalTime;
  }, [currentAttempt, assessment.timeLimit]);

  const [timeRemaining, setTimeRemaining] =
    useState<number>(initialTimeRemaining);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPausing, setIsPausing] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showUnansweredConfirm, setShowUnansweredConfirm] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(
    getStoredHasSubmitted,
  );
  const [isCardVisible, setIsCardVisible] = useState(false);

  const timerRef = useRef<number | null>(null);
  const studentAnswersRef = useRef<StudentAnswers | null>(studentAnswers);
  const timeRemainingRef = useRef<number>(initialTimeRemaining);
  const hasAttemptedSubmitRef = useRef<boolean>(hasAttemptedSubmit);
  const handleSubmitAssessmentRef =
    useRef<(answers: StudentAnswers, isAutoSubmit?: boolean) => void>();

  const sessionStartTimeRef = useRef<number>(
    getStoredSessionStart() || Date.now(),
  );

  const getSessionTimeSpent = useCallback(() => {
    return Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);
  }, []);

  const getTotalTimeSpent = useCallback(() => {
    const sessionTimeSpent = getSessionTimeSpent();
    const previousTimeSpent = currentAttempt?.timeSpent || 0;
    return previousTimeSpent + sessionTimeSpent;
  }, [currentAttempt?.timeSpent, getSessionTimeSpent]);

  useEffect(() => {
    studentAnswersRef.current = studentAnswers;
  }, [studentAnswers]);

  useEffect(() => {
    timeRemainingRef.current = timeRemaining;
    try {
      localStorage.setItem(TIMER_KEYS.TIME_REMAINING, timeRemaining.toString());
    } catch (error) {
      console.error("Failed to save timer to localStorage:", error);
    }
  }, [timeRemaining]);

  useEffect(() => {
    hasAttemptedSubmitRef.current = hasAttemptedSubmit;
    try {
      localStorage.setItem(
        TIMER_KEYS.HAS_SUBMITTED,
        hasAttemptedSubmit.toString(),
      );
    } catch (error) {
      console.error("Failed to save submission state to localStorage:", error);
    }
  }, [hasAttemptedSubmit]);

  useEffect(() => {
    try {
      localStorage.setItem(
        TIMER_KEYS.SESSION_START,
        sessionStartTimeRef.current.toString(),
      );
    } catch (error) {
      console.error(
        "Failed to save session start time to localStorage:",
        error,
      );
    }
  }, []);

  const { mutate: submitAssessment } = useSubmitAssessmentAttempt();
  const { mutate: savePausedAssessment } = useSavePausedAssessment();

  const attemptData = useMemo(
    () => ({
      id: currentAttempt?.id || `attempt-${Date.now()}`,
      studentId: currentAttempt?.studentId || "",
      assessmentId: currentAttempt?.assessmentId || assessment.id,
    }),
    [
      currentAttempt?.id,
      currentAttempt?.studentId,
      currentAttempt?.assessmentId,
      assessment.id,
    ],
  );

  const clearAllStorage = useCallback(() => {
    clearTimerStorage();
  }, []);

  const getTotalQuestions = useCallback((): number => {
    let count = 0;
    assessment.pages.forEach((page) => {
      page.contents.forEach((content) => {
        if (content.type === "question") {
          count++;
        }
      });
    });
    return count;
  }, [assessment]);

  const getUnansweredCount = useCallback(
    (answers: StudentAnswers): number => {
      const totalQuestions = getTotalQuestions();
      return Math.max(totalQuestions - answers.length, 0);
    },
    [getTotalQuestions],
  );

  const submissionHandlersRef = useRef({
    handleSubmissionSuccess: (
      savedAttempt: AssessmentAttempt,
      isAutoSubmit: boolean = false,
    ) => {
      setIsSubmitting(false);
      resetAnswers();
      closePreview();
      clearAllStorage();

      if (onSubmitted) onSubmitted(savedAttempt);
      if (!isAutoSubmit) {
        toast.success("Assessment submitted successfully!", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    },
    handleSubmissionError: (error: unknown) => {
      const apiError: APIErrorResponse = handleApiError(error);
      setIsSubmitting(false);
      setHasAttemptedSubmit(false);
      toast.error(apiError.message, {
        position: "bottom-right",
        autoClose: 5000,
      });
    },
    handlePauseSuccess: () => {
      setIsPausing(false);
      resetAnswers();
      closePreview();
      clearAllStorage();
      toast.success("Assessment paused successfully! You can resume later.", {
        position: "bottom-right",
        autoClose: 3000,
      });
      setTimeout(() => {
        navigate(`/student/${currentAttempt?.studentId}/assessments`);
      }, 100);
    },
    handlePauseError: (error: unknown) => {
      const apiError: APIErrorResponse = handleApiError(error);
      setIsPausing(false);
      toast.error(apiError.message, {
        position: "bottom-right",
        autoClose: 5000,
      });
    },
  });

  const handleSubmitAssessment = useCallback(
    (answers: StudentAnswers, isAutoSubmit: boolean = false) => {
      if (hasAttemptedSubmitRef.current && !isAutoSubmit) return;

      if (isAutoSubmit) {
        setIsSubmitting(true);
        setHasAttemptedSubmit(true);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        const totalTimeSpent = getTotalTimeSpent();
        const completedAttempt: AssessmentAttempt = {
          ...attemptData,
          score: 0,
          timeSpent: totalTimeSpent,
          status: "completed",
          answers,
          dateStarted: currentAttempt?.dateStarted || new Date().toISOString(),
          dateCompleted: new Date().toISOString(),
          dateUpdated: new Date().toISOString(),
        };
        submitAssessment(completedAttempt, {
          onSuccess: (savedAttempt) =>
            submissionHandlersRef.current.handleSubmissionSuccess(
              savedAttempt,
              isAutoSubmit,
            ),
          onError: submissionHandlersRef.current.handleSubmissionError,
        });
        return;
      }

      const unansweredCount = getUnansweredCount(answers);
      if (unansweredCount > 0) {
        setShowUnansweredConfirm(true);
        return;
      }

      setIsSubmitting(true);
      setHasAttemptedSubmit(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      const totalTimeSpent = getTotalTimeSpent();
      const completedAttempt: AssessmentAttempt = {
        ...attemptData,
        score: 0,
        timeSpent: totalTimeSpent,
        status: "completed",
        answers,
        dateStarted: currentAttempt?.dateStarted || new Date().toISOString(),
        dateCompleted: new Date().toISOString(),
        dateUpdated: new Date().toISOString(),
      };
      submitAssessment(completedAttempt, {
        onSuccess: (savedAttempt) =>
          submissionHandlersRef.current.handleSubmissionSuccess(
            savedAttempt,
            isAutoSubmit,
          ),
        onError: submissionHandlersRef.current.handleSubmissionError,
      });
    },
    [
      attemptData,
      getTotalTimeSpent,
      currentAttempt?.dateStarted,
      submitAssessment,
      getUnansweredCount,
    ],
  );

  const handleConfirmSubmitWithUnanswered = useCallback(() => {
    setShowUnansweredConfirm(false);
    setIsSubmitting(true);
    setHasAttemptedSubmit(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    const totalTimeSpent = getTotalTimeSpent();
    const completedAttempt: AssessmentAttempt = {
      ...attemptData,
      score: 0,
      timeSpent: totalTimeSpent,
      status: "completed",
      answers: (studentAnswersRef.current as StudentAnswers) || [],
      dateStarted: currentAttempt?.dateStarted || new Date().toISOString(),
      dateCompleted: new Date().toISOString(),
      dateUpdated: new Date().toISOString(),
    };
    submitAssessment(completedAttempt, {
      onSuccess: (savedAttempt) =>
        submissionHandlersRef.current.handleSubmissionSuccess(
          savedAttempt,
          false,
        ),
      onError: submissionHandlersRef.current.handleSubmissionError,
    });
  }, [
    attemptData,
    getTotalTimeSpent,
    currentAttempt?.dateStarted,
    submitAssessment,
  ]);

  const handlePauseAssessment = useCallback(
    (answers: StudentAnswers) => {
      setIsPausing(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      const totalTimeSpent = getTotalTimeSpent();
      const pausedAttempt: AssessmentAttempt = {
        ...attemptData,
        score: 0,
        timeSpent: totalTimeSpent,
        status: "paused",
        answers,
        dateStarted: currentAttempt?.dateStarted || new Date().toISOString(),
        dateUpdated: new Date().toISOString(),
      };
      savePausedAssessment(pausedAttempt, {
        onSuccess: submissionHandlersRef.current.handlePauseSuccess,
        onError: submissionHandlersRef.current.handlePauseError,
      });
    },
    [
      attemptData,
      getTotalTimeSpent,
      currentAttempt?.dateStarted,
      savePausedAssessment,
    ],
  );

  useEffect(() => {
    handleSubmitAssessmentRef.current = handleSubmitAssessment;
  }, [handleSubmitAssessment]);

  useEffect(() => {
    if (!assessment.timeLimit || hasAttemptedSubmitRef.current) return;

    timeRemainingRef.current = initialTimeRemaining;
    setTimeRemaining(initialTimeRemaining);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = window.setInterval(() => {
      timeRemainingRef.current = Math.max(timeRemainingRef.current - 1, 0);
      setTimeRemaining(timeRemainingRef.current);

      try {
        localStorage.setItem(
          TIMER_KEYS.TIME_REMAINING,
          timeRemainingRef.current.toString(),
        );
      } catch (error) {
        console.error("Failed to save timer to localStorage:", error);
      }

      if (timeRemainingRef.current <= 0) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        handleSubmitAssessmentRef.current?.(
          (studentAnswersRef.current as StudentAnswers) || [],
          true,
        );
      }
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [assessment.timeLimit, initialTimeRemaining]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasAttemptedSubmitRef.current) {
        event.preventDefault();
        event.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
        return event.returnValue;
      }
    };

    const handlePopState = (event: PopStateEvent) => {
      if (!hasAttemptedSubmitRef.current) {
        event.preventDefault();
        setShowExitConfirm(true);
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    window.history.pushState(null, "", window.location.href);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleConfirmExit = () => {
    setShowExitConfirm(false);
    clearAllStorage();
    window.history.go(-2);
  };

  const handleCancelExit = () => {
    setShowExitConfirm(false);
  };

  const handleExitClick = () => setShowExitConfirm(true);

  const handlePauseClick = () => {
    handlePauseAssessment((studentAnswersRef.current as StudentAnswers) || []);
    setShowExitConfirm(false);
  };

  const toggleCardVisibility = () => setIsCardVisible(!isCardVisible);

  const unansweredCount = getUnansweredCount(studentAnswers);
  const totalQuestions = getTotalQuestions();

  if (!isOpen || mode !== "assessment") return <></>;

  return (
    <div className="fixed inset-0 bg-background flex flex-col z-50">
      <AssessmentHeader
        assessment={assessment}
        onClose={handleExitClick}
        timeRemaining={timeRemaining}
        totalTime={assessment.timeLimit ? assessment.timeLimit * 60 : 0}
      />
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full overflow-y-auto">
          <div className="max-w-4xl mx-auto py-6">
            <AssessmentContent />
          </div>
        </div>
        {!isCardVisible && (
          <Button
            variant="outline"
            size="icon"
            onClick={toggleCardVisibility}
            className="absolute top-6 right-6 w-10 h-10 shadow-sm z-10"
            title="Show assessment details"
          >
            <FaInfoCircle className="w-4 h-4" />
          </Button>
        )}
        {isCardVisible && (
          <FloatingCard
            assessment={assessment}
            onClose={toggleCardVisibility}
          />
        )}
      </div>
      <AssessmentNavigation
        onSubmit={() =>
          handleSubmitAssessmentRef.current?.(
            (studentAnswersRef.current as StudentAnswers) || [],
            false,
          )
        }
        isSubmitting={isSubmitting || isPausing}
      />

      {/* Exit Confirmation Modal */}
      <ExitConfirmationModal
        isOpen={showExitConfirm}
        onConfirm={handleConfirmExit}
        onCancel={handleCancelExit}
        onPause={handlePauseClick}
        onSubmitAndExit={() => {
          handleSubmitAssessmentRef.current?.(
            (studentAnswersRef.current as StudentAnswers) || [],
            false,
          );
          setShowExitConfirm(false);
        }}
        timeRemaining={timeRemaining}
        showPauseOption={false}
      />

      {/* Unanswered Questions Warning Modal */}
      <UnansweredQuestionsModal
        isOpen={showUnansweredConfirm}
        onConfirm={handleConfirmSubmitWithUnanswered}
        onCancel={() => setShowUnansweredConfirm(false)}
        unansweredCount={unansweredCount}
        totalQuestions={totalQuestions}
      />
    </div>
  );
}
