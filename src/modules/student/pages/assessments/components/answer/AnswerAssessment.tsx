import { ReactElement, useCallback, useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import StudentAssessmentComponent from "./StudentAssessment";
import AssessmentResult from "./AssessmentResult";
import { IoClose } from "react-icons/io5";
import { useStudentContext } from "../../../../contexts/student.context";
import { usePreview } from "../../../../../core/contexts/preview/preview.context";
import { useStudentAssessment } from "../../../../services/student-assessment.service";
import {
  useAssessmentAttempt,
  useResumeAssessment,
} from "../../../../services/student-assessment-attempt.service";
import { AssessmentAttempt } from "../../../../../core/types/assessment-attempt/assessment-attempt.type";
import {
  canRetakeAssessment,
  getCompletedAttemptsCount,
} from "../../../../utils/assessments/assessment.util";
import { Button } from "../../../../../../components/ui/button";
import { Card, CardContent } from "../../../../../../components/ui/card";

export default function AnswerAssessment(): ReactElement {
  const { studentId, assessmentId } = useParams<{
    studentId: string;
    assessmentId: string;
  }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { student } = useStudentContext();
  const { openPreview, closePreview, isOpen, resetAnswers } = usePreview();

  const { data: assessment, isPending: assessmentPending } =
    useStudentAssessment(studentId ?? "", assessmentId ?? "");

  const { data: attempts = [], refetch: refetchAttempts } =
    useAssessmentAttempt(studentId ?? "", assessmentId ?? "");

  const { data: pausedAttempt, refetch: refetchPausedAttempt } =
    useResumeAssessment(studentId ?? "", assessmentId ?? "");

  const [currentAttempt, setCurrentAttempt] =
    useState<AssessmentAttempt | null>(null);
  const [submittedAttempt, setSubmittedAttempt] =
    useState<AssessmentAttempt | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [canRetake, setCanRetake] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isResumingPaused, setIsResumingPaused] = useState(false);

  const isRetakeFromDetails = searchParams.get("retake") === "true";
  const isResume = searchParams.get("resume") === "true";
  const completedAttemptsCount = getCompletedAttemptsCount(attempts);

  const checkIfCanRetake = useCallback(() => {
    if (!assessment || !student) return false;
    return canRetakeAssessment(assessment, student, attempts);
  }, [assessment, student, attempts]);

  useEffect(() => {
    if (assessment && student) {
      setCanRetake(checkIfCanRetake());
    }
  }, [assessment, student, attempts, checkIfCanRetake]);

  useEffect(() => {
    if (studentId && assessmentId) refetchPausedAttempt();
  }, [studentId, assessmentId, refetchPausedAttempt]);

  useEffect(() => {
    if (!assessment || !student || hasInitialized) return;

    const canTakeNew = checkIfCanRetake();

    const completedAttempt = attempts
      .filter((a) => a.status === "completed" || a.status === "failed")
      .sort(
        (a, b) =>
          new Date(b.dateCompleted || b.dateUpdated).getTime() -
          new Date(a.dateCompleted || a.dateUpdated).getTime(),
      )[0];

    if (isResume && pausedAttempt) {
      setCurrentAttempt(pausedAttempt);
      setIsResumingPaused(true);
      setHasInitialized(true);
      return;
    }

    if (completedAttempt && !isRetakeFromDetails && !isResume) {
      setSubmittedAttempt(completedAttempt);
      setShowResult(true);
      setHasInitialized(true);
      return;
    }

    if (!canTakeNew && !isRetakeFromDetails && !isResume) {
      toast.error("You have reached the maximum number of attempts.", {
        autoClose: 5000,
      });
      setTimeout(() => navigate(`/student/${studentId}/assessments`), 2000);
      setHasInitialized(true);
      return;
    }

    let newAttempt: AssessmentAttempt;
    if (pausedAttempt && !isRetakeFromDetails) {
      newAttempt = { ...pausedAttempt, dateUpdated: new Date().toISOString() };
      setIsResumingPaused(true);
    } else {
      newAttempt = {
        studentId: studentId ?? "",
        assessmentId: assessmentId ?? "",
        score: 0,
        timeSpent: 0,
        status: "paused",
        answers: [],
        dateStarted: new Date().toISOString(),
        dateUpdated: new Date().toISOString(),
      };
      setIsResumingPaused(false);
    }

    setCurrentAttempt(newAttempt);
    setHasInitialized(true);
  }, [
    assessment,
    student,
    attempts,
    pausedAttempt,
    isRetakeFromDetails,
    isResume,
    checkIfCanRetake,
    navigate,
    studentId,
    assessmentId,
    hasInitialized,
  ]);

  useEffect(() => {
    if (
      assessment &&
      currentAttempt &&
      hasInitialized &&
      !isOpen &&
      !showResult
    ) {
      openPreview(assessment, "assessment");
    }
  }, [
    assessment,
    currentAttempt,
    isOpen,
    openPreview,
    showResult,
    hasInitialized,
  ]);

  useEffect(() => {
    if (assessmentId && studentId) refetchAttempts();
  }, [assessmentId, studentId, refetchAttempts]);

  const handleAssessmentSubmitted = useCallback(
    async (attempt: AssessmentAttempt) => {
      if (attempt.status === "completed" || attempt.status === "failed") {
        setSubmittedAttempt(attempt);
        setShowResult(true);
      } else {
        navigate(`/student/${studentId}/assessments`);
      }
      closePreview();
      try {
        await refetchAttempts();
        await refetchPausedAttempt();
      } catch (err) {
        console.error("Failed to refetch attempts:", err);
      }
    },
    [closePreview, navigate, studentId, refetchAttempts, refetchPausedAttempt],
  );

  const handleRetakeAssessment = useCallback(() => {
    if (!canRetake) {
      toast.error("You have reached the maximum number of attempts.", {
        autoClose: 5000,
      });
      return;
    }
    setShowResult(false);
    setSubmittedAttempt(null);
    setCurrentAttempt(null);
    closePreview();
    resetAnswers();
    const newAttempt: AssessmentAttempt = {
      studentId: studentId ?? "",
      assessmentId: assessmentId ?? "",
      score: 0,
      timeSpent: 0,
      status: "paused",
      answers: [],
      dateStarted: new Date().toISOString(),
      dateUpdated: new Date().toISOString(),
    };
    setCurrentAttempt(newAttempt);
    setHasInitialized(true);
    refetchAttempts();
    refetchPausedAttempt();
  }, [
    canRetake,
    closePreview,
    resetAnswers,
    studentId,
    assessmentId,
    refetchAttempts,
    refetchPausedAttempt,
  ]);

  if (assessmentPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 text-muted-foreground font-medium">
            Loading Assessment
          </p>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="text-center max-w-md p-6">
          <CardContent className="p-0">
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <IoClose className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Assessment Not Found</h3>
            <p className="text-muted-foreground mb-6 text-sm">
              The requested assessment could not be located.
            </p>
            <Button
              onClick={() => navigate(`/student/${studentId}/assessments`)}
            >
              Return to Assessments
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResult && submittedAttempt && assessment) {
    return (
      <AssessmentResult
        assessment={assessment}
        attempt={submittedAttempt}
        onBack={() => navigate(`/student/${studentId}/assessments`)}
        onRetake={canRetake ? handleRetakeAssessment : undefined}
        canRetake={canRetake}
        attemptsUsed={completedAttemptsCount}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div
        className={`transition-opacity duration-200 ${currentAttempt && hasInitialized ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        {assessment && currentAttempt && (
          <StudentAssessmentComponent
            assessment={assessment}
            currentAttempt={currentAttempt}
            onSubmitted={handleAssessmentSubmitted}
          />
        )}
      </div>

      {!currentAttempt && (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-3 text-muted-foreground font-medium">
              {isResumingPaused
                ? "Resuming Assessment..."
                : "Initializing Assessment..."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
