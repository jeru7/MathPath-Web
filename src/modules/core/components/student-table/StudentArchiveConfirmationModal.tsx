import { type ReactElement } from "react";
import { useStudentAttempts } from "../../../student/services/student.service";
import { useAssessmentsAttempts } from "../../../student/services/student-assessment-attempt.service";
import { Student } from "../../../student/types/student.type";

type StudentArchiveConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  student: Student | null;
};

export default function StudentArchiveConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  student,
}: StudentArchiveConfirmationModalProps): ReactElement {
  const { data: stageAttempts } = useStudentAttempts(student?.id || "");
  const { data: assessmentAttempts } = useAssessmentsAttempts(
    student?.id || "",
  );

  const stageAttemptCount = stageAttempts?.length || 0;
  const assessmentAttemptCount = assessmentAttempts?.length || 0;

  if (!isOpen || !student) return <></>;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Archive Student
        </h3>

        <div className="space-y-3 mb-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to archive{" "}
            <strong>
              {student.firstName} {student.lastName}
            </strong>{" "}
            (LRN: {student.referenceNumber})?
          </p>

          {(assessmentAttemptCount > 0 || stageAttemptCount > 0) && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-sm p-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium mb-2">
                This student has learning data that will be preserved:
              </p>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                {assessmentAttemptCount > 0 && (
                  <li>
                    •{" "}
                    <strong>
                      {assessmentAttemptCount} assessment attempt
                      {assessmentAttemptCount !== 1 ? "s" : ""}
                    </strong>
                  </li>
                )}
                {stageAttemptCount > 0 && (
                  <li>
                    •{" "}
                    <strong>
                      {stageAttemptCount} stage attempt
                      {stageAttemptCount !== 1 ? "s" : ""}
                    </strong>
                  </li>
                )}
                <li>• All learning progress and statistics</li>
                <li>• Performance data and heatmaps</li>
              </ul>
            </div>
          )}

          {assessmentAttemptCount === 0 && stageAttemptCount === 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-sm p-3">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Note:</strong> This student has no assessment or stage
                attempts yet. Only their account information will be archived.
              </p>
            </div>
          )}

          <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-sm p-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>What happens when archiving:</strong>
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mt-1">
              <li>• Student will no longer appear in active lists</li>
              <li>• All data is preserved and can be restored later</li>
              <li>• Student cannot log in while archived</li>
              <li>• Can be restored from the archive section</li>
            </ul>
          </div>
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
            className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-sm hover:bg-yellow-700 transition-colors duration-200"
          >
            Archive Student
          </button>
        </div>
      </div>
    </div>
  );
}
