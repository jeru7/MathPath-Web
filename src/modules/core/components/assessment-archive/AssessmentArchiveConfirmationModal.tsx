import { type ReactElement } from "react";
import { Assessment } from "../../types/assessment/assessment.type";
import { Student } from "../../../student/types/student.type";

type AssessmentArchiveConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  assessment: Assessment | null;
  students: Student[];
};

export default function AssessmentArchiveConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  assessment,
  students,
}: AssessmentArchiveConfirmationModalProps): ReactElement {
  if (!isOpen || !assessment) return <></>;

  // calculate student count for the assessment
  const getStudentCountForAssessment = (assessment: Assessment): number => {
    const sectionIds = assessment.sections || [];
    return students.filter((student) => sectionIds.includes(student.sectionId))
      .length;
  };

  // calculate total questions
  const totalQuestions =
    assessment.pages?.reduce((total, page) => {
      const questionCount = page.contents.filter(
        (content) => content.type === "question",
      ).length;
      return total + questionCount;
    }, 0) || 0;

  const studentCount = getStudentCountForAssessment(assessment);
  const sectionCount = assessment.sections?.length || 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Archive Assessment
        </h3>

        <div className="space-y-3 mb-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to archive{" "}
            <strong>{assessment.title || "Untitled Assessment"}</strong>?
          </p>

          {(studentCount > 0 || totalQuestions > 0) && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-sm p-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium mb-2">
                This assessment contains data that will be preserved:
              </p>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                {studentCount > 0 && (
                  <li>
                    •{" "}
                    <strong>
                      {studentCount} student{studentCount !== 1 ? "s" : ""}
                    </strong>{" "}
                    have access to this assessment
                  </li>
                )}
                {sectionCount > 0 && (
                  <li>
                    •{" "}
                    <strong>
                      {sectionCount} section{sectionCount !== 1 ? "s" : ""}
                    </strong>{" "}
                    assigned
                  </li>
                )}
                {totalQuestions > 0 && (
                  <li>
                    •{" "}
                    <strong>
                      {totalQuestions} question{totalQuestions !== 1 ? "s" : ""}
                    </strong>{" "}
                    and assessment content
                  </li>
                )}
                <li>• All student attempts and results</li>
                <li>• Assessment configuration and settings</li>
                {assessment.timeLimit > 0 && (
                  <li>• Time limit: {assessment.timeLimit} minutes</li>
                )}
                {assessment.passingScore > 0 && (
                  <li>• Passing score: {assessment.passingScore} points</li>
                )}
              </ul>
            </div>
          )}

          {studentCount === 0 && totalQuestions === 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-sm p-3">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Note:</strong> This assessment has no students assigned
                and no questions. Only assessment information will be archived.
              </p>
            </div>
          )}

          <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-sm p-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>What happens when archiving:</strong>
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mt-1">
              <li>• Assessment will no longer appear in active lists</li>
              <li>• All student attempts and data are preserved</li>
              <li>• Students cannot access the assessment while archived</li>
              <li>• Assessment configuration and questions are maintained</li>
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
            Archive Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
