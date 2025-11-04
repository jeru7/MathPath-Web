import { ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoWarning, IoClose, IoDocument } from "react-icons/io5";

type ExitBuilderConfirmationModalProps = {
  isOpen: boolean;
  onSaveAndExit: () => void;
  onExitWithoutSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  changesCount?: number;
};

export default function ExitBuilderConfirmationModal({
  isOpen,
  onSaveAndExit,
  onExitWithoutSave,
  onCancel,
  isSaving,
  changesCount = 0,
}: ExitBuilderConfirmationModalProps): ReactElement {
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
                  Unsaved Changes
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
                You have unsaved changes in your assessment. What would you like
                to do?
              </p>

              {/* changes summary */}
              {changesCount > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <IoDocument className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <strong>
                        {changesCount} change{changesCount !== 1 ? "s" : ""}
                      </strong>{" "}
                      will be lost if you don't save
                    </p>
                  </div>
                </div>
              )}

              {/* buttons */}
              <div className="space-y-3 mt-6">
                {/* save & exit button */}
                <button
                  onClick={onSaveAndExit}
                  disabled={isSaving}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <IoDocument className="w-4 h-4" />
                      <span>Save & Exit</span>
                    </>
                  )}
                </button>

                {/* exit without saving button */}
                <button
                  onClick={onExitWithoutSave}
                  className="w-full px-4 py-3 text-sm border border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-300 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors duration-200 font-medium"
                >
                  Exit Without Saving
                </button>

                {/* continue editing button */}
                <button
                  onClick={onCancel}
                  className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Continue Editing
                </button>
              </div>

              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <p>
                  • <strong>Save & Exit:</strong> Save all changes and return to
                  assessments
                </p>
                <p>
                  • <strong>Exit Without Saving:</strong> Discard all changes
                  made
                </p>
                <p>
                  • <strong>Continue Editing:</strong> Return to assessment
                  builder
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
