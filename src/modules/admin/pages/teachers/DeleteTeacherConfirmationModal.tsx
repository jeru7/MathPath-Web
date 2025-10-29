import { type ReactElement } from "react";
import { Teacher } from "../../../teacher/types/teacher.type";

type DeleteTeacherConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  teacher: Teacher | null;
  sectionsCount: number;
  assessmentsCount: number;
  studentsCount: number;
  isDeleting?: boolean;
};

export default function DeleteTeacherConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  teacher,
  sectionsCount,
  assessmentsCount,
  studentsCount,
  isDeleting = false,
}: DeleteTeacherConfirmationModalProps): ReactElement {
  if (!isOpen || !teacher) return <></>;

  const hasRelatedData =
    sectionsCount > 0 || assessmentsCount > 0 || studentsCount > 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Delete Teacher
        </h3>

        <div className="space-y-3 mb-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete{" "}
            <strong>
              {teacher.firstName} {teacher.lastName}
            </strong>{" "}
            ({teacher.email})? This action cannot be undone.
          </p>

          {hasRelatedData && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-sm p-3">
              <p className="text-sm text-red-700 dark:text-red-300 font-medium mb-2">
                This will permanently delete:
              </p>
              <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                {sectionsCount > 0 && (
                  <li>
                    •{" "}
                    <strong>
                      {sectionsCount} section{sectionsCount !== 1 ? "s" : ""}
                    </strong>{" "}
                    and all associated data
                  </li>
                )}
                {assessmentsCount > 0 && (
                  <li>
                    •{" "}
                    <strong>
                      {assessmentsCount} assessment
                      {assessmentsCount !== 1 ? "s" : ""}
                    </strong>{" "}
                    and all attempt records
                  </li>
                )}
                {studentsCount > 0 && (
                  <li>
                    •{" "}
                    <strong>
                      {studentsCount} student{studentsCount !== 1 ? "s" : ""}
                    </strong>{" "}
                    and all their progress data
                  </li>
                )}
                <li>• All registration codes created by this teacher</li>
                <li>• Teacher's account access and login credentials</li>
                <li>• All related requests and session data</li>
              </ul>
            </div>
          )}

          {!hasRelatedData && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-sm p-3">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Note:</strong> This teacher has no sections,
                assessments, or students yet. Only their account information
                will be deleted.
              </p>
            </div>
          )}

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-sm p-3">
            <p className="text-sm text-amber-700 dark:text-amber-300">
              <strong>Warning:</strong> This action is irreversible. All data
              associated with this teacher will be permanently removed from the
              system.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-sm hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Teacher"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
