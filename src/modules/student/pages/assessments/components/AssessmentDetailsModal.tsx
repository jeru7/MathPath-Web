import { ReactElement, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Assessment } from "../../../../core/types/assessment/assessment.type";
import { format } from "date-fns-tz";
import {
  FaTimes,
  FaClock,
  FaCalendarAlt,
  FaListAlt,
  FaRedo,
  FaHistory,
  FaPause,
  FaPlay,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { Student } from "../../../types/student.type";
import {
  useAssessmentAttempt,
  useResumeAssessment,
} from "../../../services/student-assessment-attempt.service";
import { getTotalScore } from "../../../../teacher/pages/assessments/builder/utils/assessment-builder.util";
import { AssessmentAttempt } from "../../../../core/types/assessment-attempt/assessment-attempt.type";
import AttemptReviewModal from "./assessment-attempt/AttemptReviewModal";
import { useNavigate } from "react-router-dom";
import ModalOverlay from "../../../../core/components/modal/ModalOverlay";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type AssessmentDetailsModalProps = {
  isOpen: boolean;
  assessment: Assessment | null;
  student: Student | null;
  onClose: () => void;
  onTakeAssessment: (assessment: Assessment) => void;
};

export default function AssessmentDetailsModal({
  isOpen,
  assessment,
  student,
  onClose,
}: AssessmentDetailsModalProps): ReactElement {
  const navigate = useNavigate();
  const { data: attempts = [], isLoading: attemptsLoading } =
    useAssessmentAttempt(student?.id ?? "", assessment?.id ?? "");

  const { data: pausedAttempt } = useResumeAssessment(
    student?.id ?? "",
    assessment?.id ?? "",
  );

  const [selectedAttempt, setSelectedAttempt] =
    useState<AssessmentAttempt | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [showMobileStats, setShowMobileStats] = useState(false);

  const handleViewAttempt = (attempt: AssessmentAttempt) => {
    setSelectedAttempt(attempt);
    setIsReviewModalOpen(true);
  };

  const totalAttempts = attempts.length;

  const totalQuestions = assessment?.pages.reduce((total, page) => {
    const questionCount = page.contents.filter(
      (content) => content.type === "question",
    ).length;
    return total + questionCount;
  }, 0);

  const isAssessmentAvailable = () => {
    const now = new Date();
    const startDate = assessment?.date.start
      ? new Date(assessment?.date.start)
      : null;
    const endDate = assessment?.date.end
      ? new Date(assessment?.date.end)
      : null;

    if (startDate && now < startDate) return false;
    if (endDate && now > endDate) return false;

    const nonPausedAttempts = attempts.filter(
      (attempt) => attempt.status !== "paused",
    );
    if (
      assessment?.attemptLimit &&
      assessment?.attemptLimit > 0 &&
      nonPausedAttempts.length >= assessment?.attemptLimit
    ) {
      return false;
    }

    return true;
  };

  const getTimeRemaining = () => {
    if (!assessment?.date.end) return "No deadline";

    const endDate = new Date(assessment?.date.end);
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h remaining`;

    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${minutes}m remaining`;
  };

  const canTakeAssessment = isAssessmentAvailable();

  const getAttemptDisplayText = (status: string) => {
    switch (status) {
      case "completed":
        return "Pass";
      case "failed":
        return "Fail";
      case "paused":
        return "Paused";
      case "abandoned":
        return "Abandoned";
      default:
        return "In Progress";
    }
  };

  const getAttemptDisplayVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "failed":
        return "destructive";
      case "paused":
        return "secondary";
      case "abandoned":
        return "outline";
      default:
        return "default";
    }
  };

  const hasPausedAttempt =
    pausedAttempt || attempts.some((attempt) => attempt.status === "paused");

  const currentPausedAttempt =
    pausedAttempt || attempts.find((attempt) => attempt.status === "paused");

  const handleTakeAssessmentDirect = (assessment: Assessment) => {
    if (hasPausedAttempt) {
      navigate(`${assessment.id}/attempt?resume=true`);
    } else {
      const isRetake = attempts.length > 0;
      const url = isRetake
        ? `${assessment.id}/attempt?retake=true`
        : `${assessment.id}/attempt`;
      navigate(url);
    }
    onClose();
  };

  const getActionButtonText = () => {
    if (!canTakeAssessment) return "Not Available";

    if (hasPausedAttempt) {
      return "Continue Assessment";
    }

    return attempts.length > 0 ? "Retake Assessment" : "Take Assessment";
  };

  const getActionButtonVariant = () => {
    if (!canTakeAssessment) return "outline";
    if (hasPausedAttempt) return "default";
    return "default";
  };

  if (!assessment || !student) {
    return (
      <ModalOverlay isOpen={isOpen} onClose={onClose}>
        <Card className="h-[100dvh] w-[100dvw] rounded-none md:h-[85dvh] md:w-[90dvw] lg:w-[75dvw] md:max-w-7xl md:max-h-[800px] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-bold">Assessment Not Found</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <FaTimes className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 p-6 flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              Unable to load assessment details. Please try again.
            </p>
          </div>
          <div className="flex justify-end gap-3 p-4 border-t bg-muted/50">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </Card>
      </ModalOverlay>
    );
  }

  return (
    <>
      <ModalOverlay isOpen={isOpen} onClose={onClose}>
        <Card className="h-[100dvh] w-[100dvw] rounded-none md:rounded-sm md:h-[85dvh] md:w-[90dvw] lg:w-[75dvw] md:max-w-7xl md:max-h-[800px] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold truncate">
                  {assessment.title || "Untitled Assessment"}
                </h2>
                <div className="sm:hidden flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {totalQuestions} questions
                  </span>
                  <span className="text-xs text-muted-foreground">
                    • {totalAttempts}/{assessment.attemptLimit || "∞"} attempts
                  </span>
                  {hasPausedAttempt && (
                    <Badge variant="secondary" className="text-xs">
                      Paused
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <FaTimes className="w-4 h-4" />
            </Button>
          </div>

          <div className="sm:hidden border-b">
            <Button
              variant="ghost"
              className="w-full p-3 flex items-center justify-between"
              onClick={() => setShowMobileStats(!showMobileStats)}
            >
              <span className="text-sm font-medium">Assessment Details</span>
              {showMobileStats ? (
                <FaChevronUp className="w-4 h-4" />
              ) : (
                <FaChevronDown className="w-4 h-4" />
              )}
            </Button>

            <AnimatePresence>
              {showMobileStats && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 bg-muted/50 border-t">
                    <div className="grid grid-cols-2 gap-3">
                      <Card>
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-sm">
                              <FaListAlt className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">
                                Questions
                              </p>
                              <p className="text-base font-bold">
                                {totalQuestions}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-sm">
                              <FaClock className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">
                                Duration
                              </p>
                              <p className="text-base font-bold text-orange-600 dark:text-orange-400">
                                {assessment.timeLimit
                                  ? `${assessment.timeLimit}m`
                                  : "No limit"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-sm">
                              <FaRedo className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">
                                Attempts
                              </p>
                              <p className="text-base font-bold text-purple-600 dark:text-purple-400">
                                {totalAttempts}/{assessment.attemptLimit || "∞"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-sm">
                              <FaCalendarAlt className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">
                                Time Left
                              </p>
                              <p className="font-bold text-green-600 dark:text-green-400 text-xs">
                                {getTimeRemaining()}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="hidden sm:grid grid-cols-2 gap-3 p-4 bg-muted/50 border-b">
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <FaListAlt className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-xs text-muted-foreground">Questions</p>
                      <p className="text-sm font-medium">{totalQuestions}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <FaClock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="text-sm font-medium">
                        {assessment.timeLimit
                          ? `${assessment.timeLimit} minutes`
                          : "No limit"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <FaRedo className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <div>
                      <p className="text-xs text-muted-foreground">Attempts</p>
                      <p className="text-sm font-medium">
                        {totalAttempts}/{assessment.attemptLimit || "∞"}
                        {hasPausedAttempt && (
                          <span className="block text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                            (1 paused)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <FaCalendarAlt className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Time Remaining
                      </p>
                      <p className="text-sm font-medium">
                        {getTimeRemaining()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="p-4">
              {hasPausedAttempt && currentPausedAttempt && (
                <Card className="mb-4 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <FaPause className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
                          Assessment Paused
                        </h3>
                        <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                          You have an incomplete attempt. You can continue where
                          you left off.
                          {currentPausedAttempt.timeSpent > 0 && (
                            <span className="block text-xs mt-1">
                              Time spent:{" "}
                              {Math.floor(currentPausedAttempt.timeSpent / 60)}:
                              {(currentPausedAttempt.timeSpent % 60)
                                .toString()
                                .padStart(2, "0")}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {assessment.description && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-2">Description</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {assessment.description}
                  </p>
                </div>
              )}

              {assessment.topic && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-2">Topic</h3>
                  <p className="text-sm text-muted-foreground">
                    {assessment.topic}
                  </p>
                </div>
              )}

              {attemptsLoading ? (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    Loading attempts...
                  </p>
                </div>
              ) : attempts.length > 0 ? (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FaHistory className="w-4 h-4" />
                    Attempt History
                  </h3>
                  <div className="space-y-2">
                    {attempts.slice().map((attempt, index) => (
                      <Card key={attempt.id}>
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                Attempt {attempts.length - index}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge
                                  variant={getAttemptDisplayVariant(
                                    attempt.status,
                                  )}
                                >
                                  {getAttemptDisplayText(attempt.status)}
                                </Badge>
                                {attempt.score !== undefined &&
                                  attempt.status !== "paused" && (
                                    <span className="text-xs text-muted-foreground">
                                      Score: {attempt.score}
                                    </span>
                                  )}
                              </div>
                              {attempt.dateCompleted && (
                                <p className="text-xs text-muted-foreground truncate mt-1">
                                  {format(
                                    new Date(attempt.dateCompleted),
                                    "MMM d, yyyy 'at' h:mm a",
                                    { timeZone: "Asia/Manila" },
                                  )}
                                </p>
                              )}
                              {attempt.status === "paused" &&
                                attempt.dateUpdated && (
                                  <p className="text-xs text-muted-foreground truncate mt-1">
                                    Last updated:{" "}
                                    {format(
                                      new Date(attempt.dateUpdated),
                                      "MMM d, yyyy 'at' h:mm a",
                                      { timeZone: "Asia/Manila" },
                                    )}
                                  </p>
                                )}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                              {(attempt.status === "completed" ||
                                attempt.status === "failed") && (
                                  <div className="text-right">
                                    <p className="text-sm font-medium">
                                      {attempt.score || 0}/
                                      {getTotalScore(assessment)}
                                    </p>
                                  </div>
                                )}
                              {attempt.status !== "paused" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleViewAttempt(attempt)}
                                >
                                  Review
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-1 gap-3 text-sm">
                <Card>
                  <CardContent className="p-3">
                    <p className="text-muted-foreground mb-1">Starts</p>
                    <p>
                      {assessment.date.start
                        ? format(
                          new Date(assessment.date.start),
                          "MMM d, yyyy 'at' h:mm a",
                          {
                            timeZone: "Asia/Manila",
                          },
                        )
                        : "Immediately"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <p className="text-muted-foreground mb-1">Ends</p>
                    <p>
                      {assessment.date.end
                        ? format(
                          new Date(assessment.date.end),
                          "MMM d, yyyy 'at' h:mm a",
                          {
                            timeZone: "Asia/Manila",
                          },
                        )
                        : "No deadline"}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 p-4 border-t bg-muted/50">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button
              onClick={() => handleTakeAssessmentDirect(assessment)}
              disabled={!canTakeAssessment}
              variant={getActionButtonVariant()}
              className="min-w-[140px]"
            >
              {hasPausedAttempt && <FaPlay className="w-3 h-3 mr-2" />}
              {getActionButtonText()}
            </Button>
          </div>
        </Card>
      </ModalOverlay>

      <AttemptReviewModal
        isOpen={isReviewModalOpen}
        assessment={assessment}
        attempt={selectedAttempt}
        student={student}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedAttempt(null);
        }}
      />
    </>
  );
}
