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

type StudentAssessmentProps = {
  assessment: Assessment;
  currentAttempt: AssessmentAttempt | null;
  onBack?: () => void;
  onSubmitted?: (attempt: AssessmentAttempt) => void;
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

    const totalTime = assessment.timeLimit * 60;

    if (currentAttempt?.timeSpent && currentAttempt.timeSpent > 0) {
      const remaining = Math.max(totalTime - currentAttempt.timeSpent, 0);
      return remaining;
    }

    return totalTime;
  }, [currentAttempt, assessment.timeLimit]);

  const [timeRemaining, setTimeRemaining] =
    useState<number>(initialTimeRemaining);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPausing, setIsPausing] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState(false);

  const timerRef = useRef<number | null>(null);
  const studentAnswersRef = useRef<StudentAnswers | null>(studentAnswers);
  const timeRemainingRef = useRef<number>(initialTimeRemaining);
  const hasAttemptedSubmitRef = useRef<boolean>(hasAttemptedSubmit);
  const handleSubmitAssessmentRef =
    useRef<(answers: StudentAnswers, isAutoSubmit?: boolean) => void>();
  const sessionStartTimeRef = useRef<number>(Date.now()); // track session start time

  const getSessionTimeSpent = useCallback(() => {
    const sessionTime = Math.floor(
      (Date.now() - sessionStartTimeRef.current) / 1000,
    );
    return sessionTime;
  }, []);

  const getTotalTimeSpent = useCallback(() => {
    const sessionTimeSpent = getSessionTimeSpent();
    const previousTimeSpent = currentAttempt?.timeSpent || 0;
    const totalTimeSpent = previousTimeSpent + sessionTimeSpent;

    return totalTimeSpent;
  }, [currentAttempt?.timeSpent, getSessionTimeSpent]);

  useEffect(() => {
    studentAnswersRef.current = studentAnswers;
  }, [studentAnswers]);

  useEffect(() => {
    timeRemainingRef.current = timeRemaining;
  }, [timeRemaining]);

  useEffect(() => {
    hasAttemptedSubmitRef.current = hasAttemptedSubmit;
  }, [hasAttemptedSubmit]);

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

  const submissionHandlersRef = useRef({
    handleSubmissionSuccess: (
      savedAttempt: AssessmentAttempt,
      isAutoSubmit: boolean = false,
    ) => {
      setIsSubmitting(false);
      resetAnswers();
      closePreview();

      if (onSubmitted) {
        onSubmitted(savedAttempt);
      }

      if (!isAutoSubmit) {
        toast.success("Assessment submitted successfully!", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
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
        hideProgressBar: false,
      });
    },
    handlePauseSuccess: () => {
      setIsPausing(false);
      resetAnswers();
      closePreview();

      toast.success("Assessment paused successfully! You can resume later.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
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
        hideProgressBar: false,
      });
    },
  });

  useEffect(() => {
    submissionHandlersRef.current.handleSubmissionSuccess = (
      savedAttempt: AssessmentAttempt,
      isAutoSubmit: boolean = false,
    ) => {
      setIsSubmitting(false);
      resetAnswers();
      closePreview();

      if (onSubmitted) {
        onSubmitted(savedAttempt);
      }

      if (!isAutoSubmit) {
        toast.success("Assessment submitted successfully!", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
      }
    };

    submissionHandlersRef.current.handlePauseSuccess = () => {
      setIsPausing(false);
      resetAnswers();
      closePreview();

      toast.success("Assessment paused successfully! You can resume later.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
      });

      setTimeout(() => {
        navigate(`/student/${currentAttempt?.studentId}/assessments`);
      }, 100);
    };
  }, [
    resetAnswers,
    closePreview,
    onSubmitted,
    navigate,
    currentAttempt?.studentId,
  ]);

  const handleSubmitAssessment = useCallback(
    (answers: StudentAnswers, isAutoSubmit: boolean = false) => {
      if (hasAttemptedSubmitRef.current && !isAutoSubmit) return;

      setIsSubmitting(true);
      if (!isAutoSubmit) {
        setHasAttemptedSubmit(true);
      }

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
        answers: answers,
        dateStarted: currentAttempt?.dateStarted || new Date().toISOString(),
        dateCompleted: new Date().toISOString(),
        dateUpdated: new Date().toISOString(),
        currentPage: 0,
        percentage: 0,
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
    ],
  );

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
        answers: answers,
        dateStarted: currentAttempt?.dateStarted || new Date().toISOString(),
        dateUpdated: new Date().toISOString(),
        currentPage: 0,
        percentage: 0,
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
    if (!assessment.timeLimit || hasAttemptedSubmitRef.current) {
      return;
    }

    sessionStartTimeRef.current = Date.now();

    timeRemainingRef.current = initialTimeRemaining;
    setTimeRemaining(initialTimeRemaining);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    timerRef.current = window.setInterval(() => {
      timeRemainingRef.current = Math.max(timeRemainingRef.current - 1, 0);
      setTimeRemaining(timeRemainingRef.current);

      if (timeRemainingRef.current <= 0) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        if (handleSubmitAssessmentRef.current) {
          handleSubmitAssessmentRef.current(
            (studentAnswersRef.current as StudentAnswers) || {},
            true,
          );
        }
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
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasAttemptedSubmitRef.current) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
        return "You have unsaved changes. Are you sure you want to leave?";
      }
      return undefined;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const handleExitClick = () => {
    setShowExitConfirm(true);
  };

  const handleConfirmExit = () => {
    if (handleSubmitAssessmentRef.current) {
      handleSubmitAssessmentRef.current(
        (studentAnswersRef.current as StudentAnswers) || {},
        true,
      );
    }
    setShowExitConfirm(false);
  };

  const handlePauseClick = () => {
    handlePauseAssessment((studentAnswersRef.current as StudentAnswers) || {});
    setShowExitConfirm(false);
  };

  const handleCancelExit = () => {
    setShowExitConfirm(false);
  };

  const toggleCardVisibility = () => {
    setIsCardVisible(!isCardVisible);
  };

  if (!isOpen || mode !== "assessment") {
    return <></>;
  }

  return (
    <div className="fixed inset-0 bg-gray-50 dark:bg-gray-900 flex flex-col z-50">
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

        {/* toggle button for information */}
        {!isCardVisible && (
          <button
            onClick={toggleCardVisibility}
            className="flex absolute top-6 right-6 w-10 h-10 bg-white dark:bg-gray-800 rounded-sm shadow-sm border border-gray-200 dark:border-gray-700 items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-10"
            title="Show assessment details"
          >
            <FaInfoCircle className="w-4 h-4" />
          </button>
        )}

        {isCardVisible && (
          <FloatingCard
            assessment={assessment}
            onClose={toggleCardVisibility}
          />
        )}
      </div>

      <AssessmentNavigation
        onSubmit={() => {
          if (handleSubmitAssessmentRef.current) {
            handleSubmitAssessmentRef.current(
              (studentAnswersRef.current as StudentAnswers) || {},
              false,
            );
          }
        }}
        isSubmitting={isSubmitting || isPausing}
      />

      <ExitConfirmationModal
        isOpen={showExitConfirm}
        onConfirm={handleConfirmExit}
        onCancel={handleCancelExit}
        onPause={handlePauseClick}
        timeRemaining={timeRemaining}
        showPauseOption={true}
      />
    </div>
  );
}
