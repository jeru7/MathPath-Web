import { useState, type ReactElement } from "react";
import {
  IoAlertCircle,
  IoCheckmarkCircle,
  IoChevronDown,
  IoChevronUp,
  IoCloseCircle,
  IoEye,
  IoPause,
  IoTime,
} from "react-icons/io5";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { AttemptWithAssessment } from "../StudentDetailsModal";
import { Student } from "../../../../../student/types/student.type";
import { AssessmentAttempt } from "../../../../types/assessment-attempt/assessment-attempt.type";
import { Assessment } from "../../../../types/assessment/assessment.type";
import AttemptReviewModal from "../../../../../student/pages/assessments/components/assessment-attempt/AttemptReviewModal";

type AssessmentAttemptItemProps = {
  attempt: AttemptWithAssessment;
  student: Student;
};

export default function AssessmentAttemptItem({
  attempt,
  student,
}: AssessmentAttemptItemProps): ReactElement {
  const toggleAttempt = (attemptId: string) => {
    setExpandedAttempt(expandedAttempt === attemptId ? null : attemptId);
  };
  const [expandedAttempt, setExpandedAttempt] = useState<string | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedAttempt, setSelectedAttempt] =
    useState<AssessmentAttempt | null>(null);
  const [selectedAssessment, setSelectedAssessment] =
    useState<Assessment | null>(null);

  const handleReviewAttempt = (attempt: AttemptWithAssessment) => {
    setSelectedAttempt(attempt);
    setSelectedAssessment(attempt.assessmentData);
    setReviewModalOpen(true);
  };

  const getStatusIcon = (status: AssessmentAttempt["status"]) => {
    switch (status) {
      case "completed":
        return <IoCheckmarkCircle className="w-4 h-4 text-green-500" />;
      case "paused":
        return <IoPause className="w-4 h-4 text-yellow-500" />;
      case "abandoned":
        return <IoCloseCircle className="w-4 h-4 text-red-500" />;
      case "failed":
        return <IoAlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <IoTime className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: AssessmentAttempt["status"]) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "paused":
        return "Paused";
      case "abandoned":
        return "Abandoned";
      case "failed":
        return "Failed";
      default:
        return "Unknown";
    }
  };

  const getScoreColor = (percentage: number, passingScore: number) => {
    if (percentage >= passingScore) return "text-green-600 dark:text-green-400";
    if (percentage >= passingScore * 0.7)
      return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const formatTimeSpent = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  const handleCloseReviewModal = () => {
    setReviewModalOpen(false);
    setSelectedAttempt(null);
    setSelectedAssessment(null);
  };

  return (
    <div
      key={attempt.id}
      className="border border-gray-200 dark:border-gray-600 rounded-sm overflow-hidden"
    >
      <div
        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer flex justify-between items-center"
        onClick={() => toggleAttempt(attempt.id || "")}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {getStatusIcon(attempt.status)}
            <h4 className="font-medium text-gray-900 dark:text-gray-100">
              {attempt.assessmentTitle}
            </h4>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${attempt.status === "completed"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : attempt.status === "paused"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                    : attempt.status === "failed"
                      ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                }`}
            >
              {getStatusText(attempt.status)}
            </span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>Time Spent: {formatTimeSpent(attempt.timeSpent)}</span>
            <span>
              Completed:{" "}
              {attempt.dateCompleted
                ? format(
                  new Date(attempt.dateCompleted),
                  "MMM d, yyyy 'at' h:mm a",
                )
                : format(
                  new Date(attempt.dateUpdated),
                  "MMM d, yyyy 'at' h:mm a",
                )}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div
              className={`text-lg font-bold ${getScoreColor(attempt.score, attempt.assessmentPassingScore)}`}
            >
              {attempt.score} points
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Passing: {attempt.assessmentPassingScore} points
            </div>
          </div>
          {expandedAttempt === attempt.id ? (
            <IoChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <IoChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      <AnimatePresence>
        {expandedAttempt === attempt.id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="border-t border-gray-200 dark:border-gray-600 p-4 bg-gray-50 dark:bg-gray-700/30">
              <div className="flex justify-between items-start mb-3">
                <h5 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                  Attempt Details
                </h5>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReviewAttempt(attempt);
                  }}
                  className="flex items-center gap-2 px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-sm transition-colors duration-200"
                >
                  <IoEye className="w-3 h-3" />
                  Review Answers
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Status:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                      {attempt.status}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Time Spent:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formatTimeSpent(attempt.timeSpent)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Date Started:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {format(
                        new Date(attempt.dateStarted),
                        "MMM d, yyyy 'at' h:mm a",
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Raw Score:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {attempt.score} points
                    </span>
                  </div>
                  {attempt.dateCompleted && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Date Completed:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {format(
                          new Date(attempt.dateCompleted),
                          "MMM d, yyyy 'at' h:mm a",
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {attempt.answers && Object.keys(attempt.answers).length > 0 && (
                <div className="mt-4">
                  <h6 className="font-medium text-sm mb-2 text-gray-900 dark:text-gray-100">
                    Questions Answered: {Object.keys(attempt.answers).length}
                  </h6>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Click "Review Answers" to view detailed answers and question
                    breakdown
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* review modal */}
      <AttemptReviewModal
        isOpen={reviewModalOpen}
        assessment={selectedAssessment}
        attempt={selectedAttempt}
        student={student}
        onClose={handleCloseReviewModal}
      />
    </div>
  );
}
