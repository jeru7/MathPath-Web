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

  const getAttemptDisplayColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 dark:text-green-400";
      case "failed":
        return "text-red-600 dark:text-red-400";
      case "paused":
        return "text-yellow-600 dark:text-yellow-400";
      case "abandoned":
        return "text-orange-600 dark:text-orange-400";
      default:
        return "text-blue-600 dark:text-blue-400";
    }
  };

  // check if there's a paused attempt
  const hasPausedAttempt =
    pausedAttempt || attempts.some((attempt) => attempt.status === "paused");

  // get the actual paused attempt
  const currentPausedAttempt =
    pausedAttempt || attempts.find((attempt) => attempt.status === "paused");

  const handleTakeAssessmentDirect = (assessment: Assessment) => {
    // if there's a paused attempt, resume it
    if (hasPausedAttempt) {
      navigate(`${assessment.id}/attempt?resume=true`);
    } else {
      // start a new attempt
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

  const getActionButtonIcon = () => {
    if (hasPausedAttempt) {
      return <FaPlay className="w-3 h-3 mr-2" />;
    }
    return null;
  };

  // if assessment/student is null
  if (!assessment || !student) {
    return (
      <ModalOverlay isOpen={isOpen} onClose={onClose}>
        <div className="bg-white border border-white dark:border-gray-700 dark:bg-gray-800 rounded-sm h-[100svh] w-[100svw] md:h-[85svh] md:w-[90svw] lg:w-[75svw] md:max-w-7xl md:max-h-[800px] overflow-hidden flex flex-col">
          <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-200">
              Assessment Not Found
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 hover:cursor-pointer"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </header>
          <div className="flex-1 p-6 flex items-center justify-center">
            <p className="text-gray-600 dark:text-gray-400 text-center">
              Unable to load assessment details. Please try again.
            </p>
          </div>
          <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-900 border border-gray-900 dark:border-gray-400 dark:text-gray-400 hover:text-gray-800 rounded-sm dark:hover:text-gray-200 transition-colors duration-200 hover:cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </ModalOverlay>
    );
  }

  return (
    <>
      <ModalOverlay isOpen={isOpen} onClose={onClose}>
        <div className="bg-white border border-white dark:border-gray-700 dark:bg-gray-800 rounded-sm h-[100svh] w-[100svw] md:h-[85svh] md:w-[90svw] lg:w-[75svw] md:max-w-7xl md:max-h-[800px] overflow-hidden flex flex-col">
          {/* header */}
          <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-200 truncate">
                  {assessment.title || "Untitled Assessment"}
                </h2>
                {/* mobile only summary */}
                <div className="sm:hidden flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {totalQuestions} questions
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    • {totalAttempts}/{assessment.attemptLimit || "∞"} attempts
                  </span>
                  {hasPausedAttempt && (
                    <span className="text-xs text-yellow-600 dark:text-yellow-400">
                      • Paused
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 hover:cursor-pointer flex-shrink-0 ml-2"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </header>

          {/* mobile stats toggle */}
          <div className="sm:hidden border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowMobileStats(!showMobileStats)}
              className="w-full p-3 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Assessment Details
              </span>
              {showMobileStats ? (
                <FaChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <FaChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>

            {/* mobile stats dropdown */}
            <AnimatePresence>
              {showMobileStats && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white dark:bg-gray-800 rounded-sm p-3 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-sm">
                            <FaListAlt className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                              Questions
                            </p>
                            <p className="text-base font-bold text-gray-900 dark:text-gray-100">
                              {totalQuestions}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-sm p-3 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-sm">
                            <FaClock className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                              Duration
                            </p>
                            <p className="text-base font-bold text-orange-600 dark:text-orange-400">
                              {assessment.timeLimit
                                ? `${assessment.timeLimit}m`
                                : "No limit"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-sm p-3 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-sm">
                            <FaRedo className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                              Attempts
                            </p>
                            <p className="text-base font-bold text-purple-600 dark:text-purple-400">
                              {totalAttempts}/{assessment.attemptLimit || "∞"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-sm p-3 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-sm">
                            <FaCalendarAlt className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                              Time Left
                            </p>
                            <p className="font-bold text-green-600 dark:text-green-400 text-xs">
                              {getTimeRemaining()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* content */}
          <div className="flex-1 overflow-y-auto">
            {/* desktop stats grid */}
            <div className="hidden sm:grid grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700">
                <FaListAlt className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Questions
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {totalQuestions}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700">
                <FaClock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Duration
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {assessment.timeLimit
                      ? `${assessment.timeLimit} minutes`
                      : "No limit"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700">
                <FaRedo className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Attempts
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {totalAttempts}/{assessment.attemptLimit || "∞"}
                    {hasPausedAttempt && (
                      <span className="block text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                        (1 paused)
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700">
                <FaCalendarAlt className="w-4 h-4 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Time Remaining
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {getTimeRemaining()}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4">
              {/* paused assessment banner */}
              {hasPausedAttempt && currentPausedAttempt && (
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-sm">
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
                </div>
              )}

              {/* description */}
              {assessment.description && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {assessment.description}
                  </p>
                </div>
              )}

              {/* topic */}
              {assessment.topic && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Topic
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {assessment.topic}
                  </p>
                </div>
              )}

              {/* attempt history */}
              {attemptsLoading ? (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Loading attempts...
                  </p>
                </div>
              ) : attempts.length > 0 ? (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <FaHistory className="w-4 h-4" />
                    Attempt History
                  </h3>
                  <div className="space-y-2">
                    {attempts.slice().map((attempt, index) => (
                      <div
                        key={attempt.id}
                        className="flex justify-between items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-sm"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            Attempt {attempts.length - index}
                          </p>
                          <p
                            className={`text-xs ${getAttemptDisplayColor(attempt.status)}`}
                          >
                            {getAttemptDisplayText(attempt.status)}
                            {attempt.score !== undefined &&
                              attempt.status !== "paused" &&
                              ` • Score: ${attempt.score}`}
                          </p>
                          {attempt.dateCompleted && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {format(
                                new Date(attempt.dateCompleted),
                                "MMM d, yyyy 'at' h:mm a",
                                { timeZone: "Asia/Manila" },
                              )}
                            </p>
                          )}
                          {attempt.status === "paused" &&
                            attempt.dateUpdated && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
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
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {attempt.score || 0}/{getTotalScore(assessment)}
                                </p>
                              </div>
                            )}
                          {/* hide review button for paused attempts */}
                          {attempt.status !== "paused" && (
                            <button
                              onClick={() => handleViewAttempt(attempt)}
                              className="px-3 py-1 text-xs bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-colors flex-shrink-0"
                            >
                              Review
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* schedule */}
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-sm">
                  <p className="text-gray-500 dark:text-gray-400 mb-1">
                    Starts
                  </p>
                  <p className="text-gray-900 dark:text-gray-100">
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
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-sm">
                  <p className="text-gray-500 dark:text-gray-400 mb-1">Ends</p>
                  <p className="text-gray-900 dark:text-gray-100">
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
                </div>
              </div>
            </div>
          </div>

          {/* bottom section */}
          <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-900 border border-gray-900 dark:border-gray-400 dark:text-gray-400 hover:text-gray-800 rounded-sm dark:hover:text-gray-200 transition-colors duration-200 hover:cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => handleTakeAssessmentDirect(assessment)}
              disabled={!canTakeAssessment}
              className={`px-4 py-2 text-sm font-medium text-white rounded-sm transition-all duration-200 flex items-center justify-center min-w-[140px] ${canTakeAssessment
                  ? hasPausedAttempt
                    ? "bg-yellow-600 hover:bg-yellow-700 cursor-pointer"
                    : "bg-[var(--primary-green)] hover:bg-green-600 cursor-pointer"
                  : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                }`}
            >
              {getActionButtonIcon()}
              {getActionButtonText()}
            </button>
          </div>
        </div>
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
