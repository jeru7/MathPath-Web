import { ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoWarning, IoClose, IoPause } from "react-icons/io5";

type ExitConfirmationModalProps = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onPause?: () => void;
  timeRemaining?: number;
  showPauseOption?: boolean;
};

export default function ExitConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
  onPause,
  timeRemaining,
  showPauseOption = true,
}: ExitConfirmationModalProps): ReactElement {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-[60] p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                  <IoWarning className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Exit Assessment?
                </h3>
              </div>
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              >
                <IoClose className="w-5 h-5" />
              </button>
            </div>

            {/* content */}
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                What would you like to do with your current progress?
              </p>

              {timeRemaining !== undefined && timeRemaining > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Time remaining:</strong>{" "}
                    {Math.floor(timeRemaining / 60)}:
                    {(timeRemaining % 60).toString().padStart(2, "0")}
                  </p>
                </div>
              )}

              {/* buttons */}
              <div className="space-y-3 mt-6">
                {/* pause assessment button */}
                {showPauseOption && onPause && (
                  <button
                    onClick={onPause}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 font-medium"
                  >
                    <IoPause className="w-4 h-4" />
                    <span>Pause Assessment</span>
                  </button>
                )}

                {/* exit & submit button */}
                <button
                  onClick={onConfirm}
                  className="w-full px-4 py-3 text-sm bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors duration-200 font-medium"
                >
                  Exit & Submit Final Answers
                </button>

                {/* continue assessment button */}
                <button
                  onClick={onCancel}
                  className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Continue Assessment
                </button>
              </div>

              {/* help text */}
              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <p>
                  • <strong>Pause:</strong> Save progress and resume later
                </p>
                <p>
                  • <strong>Exit & Submit:</strong> Submit final answers for
                  grading
                </p>
                <p>
                  • <strong>Continue:</strong> Return to assessment
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
