import { type ReactElement } from "react";
import { Student } from "../../../../../student/types/student.type";
import { AssessmentAttempt } from "../../../../../core/types/assessment-attempt/assessment-attempt.type";
import { getProfilePicture } from "../../../../../core/utils/profile-picture.util";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import { IoChevronDown, IoChevronUp, IoEye } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";

type AttemptItemProps = {
  attempt: AttemptWithStudent;
  passingScore: number;
  formatDuration: (seconds: number) => string;
  formatTimeSpent: (seconds: number) => string;
  formatDate: (dateString: string) => string;
  isExpanded: boolean;
  onToggle: () => void;
  onReview: () => void;
};

type AttemptWithStudent = AssessmentAttempt & {
  student: Student;
};

export default function AttemptItem({
  attempt,
  passingScore,
  formatDuration,
  formatTimeSpent,
  formatDate,
  isExpanded,
  onToggle,
  onReview,
}: AttemptItemProps): ReactElement {
  const getScoreColor = (score: number) => {
    const percentage = (score / passingScore) * 100;
    if (percentage >= 80) return "text-green-600 dark:text-green-400";
    if (percentage >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getStatusVariant = (score: number) => {
    const percentage = (score / passingScore) * 100;
    if (percentage >= 80)
      return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800";
    if (percentage >= 60)
      return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800";
    return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800";
  };

  const isPassed = (attempt.score || 0) >= passingScore;

  return (
    <div className="border border-gray-200 dark:border-gray-600 rounded-sm overflow-hidden">
      {/* header */}
      <div
        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer flex items-center gap-4"
        onClick={onToggle}
      >
        {/* profile pic */}
        <div className="flex-shrink-0">
          {attempt.student.profilePicture ? (
            <img
              src={getProfilePicture(attempt.student.profilePicture)}
              alt={`${attempt.student.firstName} ${attempt.student.lastName}`}
              className="w-10 h-10 rounded-sm object-cover border border-gray-200 dark:border-gray-600"
            />
          ) : (
            <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center border border-gray-200 dark:border-gray-600">
              <span className="text-sm font-semibold text-white">
                {attempt.student.firstName[0]}
                {attempt.student.lastName[0]}
              </span>
            </div>
          )}
        </div>

        {/* details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {attempt.student.firstName} {attempt.student.lastName}
            </h4>
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusVariant(attempt.score || 0)}`}
            >
              {isPassed ? "Passed" : "Failed"}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <FaCalendarAlt className="w-3 h-3" />
              <span>{formatDate(attempt.dateUpdated)}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaClock className="w-3 h-3" />
              <span>{formatDuration(attempt.timeSpent || 0)}</span>
            </div>
          </div>
        </div>

        {/* expand/collapse button */}
        <div className="flex-shrink-0">
          {isExpanded ? (
            <IoChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <IoChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* expandable content */}
      <AnimatePresence>
        {isExpanded && (
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
                    onReview();
                  }}
                  className="flex items-center gap-2 px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors duration-200"
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
                      {attempt.status || "unknown"}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Time Spent:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formatTimeSpent(attempt.timeSpent || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Date Started:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {attempt.dateStarted
                        ? formatDate(attempt.dateStarted)
                        : "N/A"}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Score:
                    </span>
                    <span
                      className={`font-bold ${getScoreColor(attempt.score || 0)}`}
                    >
                      {attempt.score || 0} points
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Passing Score:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {passingScore} points
                    </span>
                  </div>
                  {attempt.dateCompleted && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Date Completed:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatDate(attempt.dateCompleted)}
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
    </div>
  );
}
