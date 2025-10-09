import { type ReactElement, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Assessment } from "../../../../core/types/assessment/assessment.type";

interface DraftDecisionModalProps {
  isOpen: boolean;
  draft: Assessment | null;
  onContinue: () => void;
  onCreateNew: () => void;
  onClose: () => void;
}

export default function DraftDecisionModal({
  isOpen,
  draft,
  onContinue,
  onCreateNew,
  onClose,
}: DraftDecisionModalProps): ReactElement {
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  const calculateProgress = (assessment: Assessment): number => {
    let progress = 0;
    const totalWeight = 100;

    // basic information (30%)
    const hasBasicInfo =
      assessment.title && assessment.topic && assessment.description;
    if (hasBasicInfo) progress += 30;

    // content & questions (50%)
    let contentProgress = 0;

    if (assessment.pages && assessment.pages.length > 0) {
      const pagesWithContent = assessment.pages.filter(
        (page) => page.contents && page.contents.length > 0,
      );

      if (pagesWithContent.length > 0) {
        const hasQuestions = assessment.pages.some((page) =>
          page.contents.some((content) => content.type === "question"),
        );

        if (hasQuestions) {
          contentProgress = 50; // full points if there are questions
        } else {
          contentProgress = 25; // half points if there's content but no questions
        }
      }
    }

    progress += contentProgress;

    // settings & configuration (20%)
    const hasSettings =
      assessment.passingScore > 0 &&
      assessment.timeLimit > 0 &&
      assessment.attemptLimit > 0;
    if (hasSettings) progress += 20;

    return Math.min(progress, totalWeight);
  };

  const getProgressColor = (progress: number): string => {
    if (progress < 33) return "bg-red-500";
    if (progress < 66) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getProgressMessage = (progress: number): string => {
    if (progress < 20) return "Just started";
    if (progress < 40) return "Getting there";
    if (progress < 60) return "Halfway done";
    if (progress < 80) return "Almost there";
    return "Ready to publish";
  };

  const handleCreateNewClick = () => {
    setShowDeleteWarning(true);
  };

  const handleConfirmCreateNew = () => {
    setShowDeleteWarning(false);
    onCreateNew();
  };

  const handleCancelCreateNew = () => {
    setShowDeleteWarning(false);
  };

  if (!draft) return <></>;

  const progress = calculateProgress(draft);
  const progressColor = getProgressColor(progress);
  const progressMessage = getProgressMessage(progress);

  return (
    <>
      <AnimatePresence>
        {isOpen && !showDeleteWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl border border-gray-200 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-yellow-500 flex-shrink-0"></div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Assessment in Progress
                </h3>
              </div>

              {/* draft info card */}
              <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-start mb-3">
                  <p className="font-medium text-gray-900 dark:text-gray-100 text-sm line-clamp-2">
                    {draft.title || "Untitled Assessment"}
                  </p>
                  <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full flex-shrink-0 ml-2">
                    Draft
                  </span>
                </div>

                {draft.topic && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    Topic: {draft.topic}
                  </p>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600 dark:text-gray-400">
                      Progress
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {progress}%
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        •
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {progressMessage}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${progressColor} transition-all duration-300`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <span>
                      {draft.pages?.length || 0} page
                      {(draft.pages?.length || 0) !== 1 ? "s" : ""}
                    </span>
                    <span>
                      Last updated:{" "}
                      {draft.updatedAt
                        ? new Date(draft.updatedAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )
                        : "Recently"}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
                You have an assessment in progress. You can continue editing it
                or start a new assessment{" "}
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  (this will delete your current draft)
                </span>
                .
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNewClick}
                  className="px-4 py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium"
                >
                  Start New
                </button>
                <button
                  onClick={onContinue}
                  className="px-4 py-2 bg-[var(--primary-green)] text-white rounded-sm hover:bg-[var(--primary-green)]/80 transition-colors text-sm font-medium"
                >
                  Continue Editing
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* delete confirmation modal */}
      <AnimatePresence>
        {showDeleteWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0"></div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Delete Draft Assessment?
                </h3>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm">
                  Starting a new assessment will{" "}
                  <span className="font-semibold text-red-600 dark:text-red-400">
                    permanently delete
                  </span>{" "}
                  your current draft:
                </p>

                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-sm">
                  <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                    {draft.title || "Untitled Assessment"}
                  </p>
                  {draft.topic && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Topic: {draft.topic}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Progress: {progress}% • {draft.pages?.length || 0} pages
                  </p>
                </div>

                <p className="text-xs text-amber-600 dark:text-amber-400 mt-3">
                  This action cannot be undone. All progress on this draft will
                  be lost.
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleCancelCreateNew}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmCreateNew}
                  className="px-4 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Delete Draft & Create New
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
