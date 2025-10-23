import { ReactElement, useState } from "react";
import { Assessment } from "../../../../core/types/assessment/assessment.type";
import { format } from "date-fns-tz";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaClock,
  FaCalendarAlt,
  FaListAlt,
  FaRedo,
  FaHistory,
  FaPause,
  FaPlay,
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
      navigate(`${assessment.id}/attempt`);
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
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="bg-white border border-white dark:border-gray-700 dark:bg-gray-800 rounded-sm shadow-sm w-full max-w-2xl max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <header className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-200">
                  Assessment Not Found
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 hover:cursor-pointer"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </header>
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400">
                  Unable to load assessment details. Please try again.
                </p>
              </div>
              <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-gray-900 border border-gray-900 dark:border-gray-400 dark:text-gray-400 hover:text-gray-800 rounded-sm dark:hover:text-gray-200 transition-colors duration-200 hover:cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white border border-white dark:border-gray-700 dark:bg-gray-800 rounded-sm shadow-sm w-full max-w-2xl max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* header */}
            <header className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-200">
                {assessment.title || "Untitled Assessment"}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 hover:cursor-pointer"
              >
                <FaTimes className="w-3 h-3" />
              </button>
            </header>

            {/* content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* paused assessment banner */}
              {hasPausedAttempt && currentPausedAttempt && (
                <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-sm">
                  <div className="flex items-center gap-3">
                    <FaPause className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    <div>
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
                <div className="mb-6">
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
                <div className="mb-6">
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
                <div className="mb-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Loading attempts...
                  </p>
                </div>
              ) : attempts.length > 0 ? (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <FaHistory className="w-4 h-4" />
                    Attempt History
                  </h3>
                  <div className="space-y-2">
                    {attempts
                      .slice()
                      .reverse()
                      .map((attempt, index) => (
                        <div
                          key={attempt.id}
                          className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-sm"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
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
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {format(
                                  new Date(attempt.dateCompleted),
                                  "MMM d, yyyy 'at' h:mm a",
                                  { timeZone: "Asia/Manila" },
                                )}
                              </p>
                            )}
                            {attempt.status === "paused" &&
                              attempt.dateUpdated && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Last updated:{" "}
                                  {format(
                                    new Date(attempt.dateUpdated),
                                    "MMM d, yyyy 'at' h:mm a",
                                    { timeZone: "Asia/Manila" },
                                  )}
                                </p>
                              )}
                          </div>
                          <div className="flex items-center gap-2">
                            {(attempt.status === "completed" ||
                              attempt.status === "failed") && (
                              <div className="text-right mr-2">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {attempt.score || 0}/
                                  {getTotalScore(assessment)}
                                </p>
                              </div>
                            )}
                            {/* hide review button for paused attempts */}
                            {attempt.status !== "paused" && (
                              <button
                                onClick={() => handleViewAttempt(attempt)}
                                className="px-3 py-1 text-xs bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-colors"
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

              {/* assessment details grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* questions */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-sm">
                  <FaListAlt className="w-4 h-4 text-[var(--primary-green)]" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Questions
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {totalQuestions}
                    </p>
                  </div>
                </div>

                {/* duration */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-sm">
                  <FaClock className="w-4 h-4 text-[var(--primary-green)]" />
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

                {/* attempts */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-sm">
                  <FaRedo className="w-4 h-4 text-[var(--primary-green)]" />
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

                {/* time remaining */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-sm">
                  <FaCalendarAlt className="w-4 h-4 text-[var(--primary-green)]" />
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

              {/* schedule */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
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
                <div>
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

            {/* bottom section */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-900 border border-gray-900 dark:border-gray-400 dark:text-gray-400 hover:text-gray-800 rounded-sm dark:hover:text-gray-200 transition-colors duration-200 hover:cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => handleTakeAssessmentDirect(assessment)}
                disabled={!canTakeAssessment}
                className={`px-6 py-2 text-sm font-medium text-white rounded-sm transition-all duration-200 flex items-center ${
                  canTakeAssessment
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
          </motion.div>
        </motion.div>
      )}

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
    </AnimatePresence>
  );
}
