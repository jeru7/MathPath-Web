import { type ReactElement } from "react";
import { Assessment } from "../../../../core/types/assessment/assessment.type";

type DeleteAssessmentConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  assessment: Assessment;
  studentCount: number;
  sectionCount: number;
};

export default function DeleteAssessmentConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  assessment,
  studentCount,
  sectionCount,
}: DeleteAssessmentConfirmationModalProps): ReactElement {
  if (!isOpen || !assessment) return <></>;

  const getWarningTitle = () => {
    switch (assessment.status) {
      case "published":
        return "Delete Published Assessment";
      case "in-progress":
        return "Delete In-Progress Assessment";
      case "finished":
        return "Delete Finished Assessment";
      default:
        return "Delete Assessment";
    }
  };

  const getStatusWarning = () => {
    switch (assessment.status) {
      case "published":
        return "This assessment has been published and is currently active.";
      case "in-progress":
        return "This assessment is currently in progress by students.";
      case "finished":
        return "This assessment has been completed by students.";
      default:
        return "This assessment is in draft status.";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-sm max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {getWarningTitle()}
        </h3>

        <div className="space-y-3 mb-4">
          <p className="text-gray-600 dark:text-gray-400">
            {getStatusWarning()} Are you sure you want to delete "
            {assessment.title}"? This action cannot be undone.
          </p>

          {(studentCount > 0 || sectionCount > 0) && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-sm p-3">
              <p className="text-sm text-red-700 dark:text-red-300 font-medium mb-2">
                This will affect:
              </p>
              <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                {sectionCount > 0 && (
                  <li>
                    •{" "}
                    <strong>
                      {sectionCount} section{sectionCount !== 1 ? "s" : ""}
                    </strong>{" "}
                    assigned
                  </li>
                )}
                {studentCount > 0 && (
                  <li>
                    •{" "}
                    <strong>
                      {studentCount} student{studentCount !== 1 ? "s" : ""}
                    </strong>{" "}
                    enrolled in these sections
                  </li>
                )}
                {assessment.status === "in-progress" && studentCount > 0 && (
                  <li className="font-semibold">
                    Ongoing attempts will be lost
                  </li>
                )}
                {assessment.status === "finished" && studentCount > 0 && (
                  <li className="font-semibold">
                    All results and grades will be permanently deleted
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-sm hover:bg-red-700 transition-colors duration-200"
          >
            Delete Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
