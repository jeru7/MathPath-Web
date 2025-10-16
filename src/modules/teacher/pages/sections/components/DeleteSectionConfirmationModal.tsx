import { type ReactElement } from "react";
import { Section } from "../../../../core/types/section/section.type";

type DeleteConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  section: Section | null;
  studentCount: number;
};

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  section,
  studentCount,
}: DeleteConfirmationModalProps): ReactElement {
  if (!isOpen || !section) return <></>;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-sm max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Delete Section
        </h3>

        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Are you sure you want to delete the section "{section.name}"? This
          action cannot be undone.
        </p>

        {studentCount > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-sm p-3 mb-4">
            <p className="text-sm text-red-700 dark:text-red-300">
              <strong>Warning:</strong> This will also delete{" "}
              <strong>
                {studentCount} student{studentCount !== 1 ? "s" : ""}
              </strong>{" "}
              associated with this section.
            </p>
          </div>
        )}

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
            Delete Section
          </button>
        </div>
      </div>
    </div>
  );
}
