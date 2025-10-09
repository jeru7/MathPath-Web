// AssessmentDetailsModal.tsx
import { ReactElement } from "react";
import { Assessment } from "../../../../core/types/assessment/assessment.type";
import { format } from "date-fns-tz";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaClock,
  FaCalendarAlt,
  FaListAlt,
  FaRedo,
} from "react-icons/fa";

type AssessmentDetailsModalProps = {
  isOpen: boolean;
  assessment: Assessment | null;
  onClose: () => void;
  onTakeAssessment: (assessment: Assessment) => void;
};

export default function AssessmentDetailsModal({
  isOpen,
  assessment,
  onClose,
  onTakeAssessment,
}: AssessmentDetailsModalProps): ReactElement {
  if (!assessment) return <></>;

  const totalQuestions = assessment.pages.reduce((total, page) => {
    const questionCount = page.contents.filter(
      (content) => content.type === "question",
    ).length;
    return total + questionCount;
  }, 0);

  const isAssessmentAvailable = () => {
    const now = new Date();
    const startDate = assessment.date.start
      ? new Date(assessment.date.start)
      : null;
    const endDate = assessment.date.end ? new Date(assessment.date.end) : null;

    if (startDate && now < startDate) return false;
    if (endDate && now > endDate) return false;

    return true;
  };

  const getTimeRemaining = () => {
    if (!assessment.date.end) return "No deadline";

    const endDate = new Date(assessment.date.end);
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
                      {assessment.attemptLimit || "Unlimited"}
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
                onClick={() => onTakeAssessment(assessment)}
                disabled={!canTakeAssessment}
                className={`px-6 py-2 text-sm font-medium text-white rounded-sm transition-all duration-200 ${
                  canTakeAssessment
                    ? "bg-[var(--primary-green)] hover:bg-green-600 cursor-pointer"
                    : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                }`}
              >
                {canTakeAssessment ? "Take Assessment" : "Not Available"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
