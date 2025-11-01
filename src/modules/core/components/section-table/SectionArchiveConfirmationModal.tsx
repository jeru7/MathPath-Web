import { type ReactElement } from "react";
import { Section } from "../../types/section/section.type";
import { getStudentCountForSection } from "../../utils/section/section.util";
import { Student } from "../../../student/types/student.type";
import { Assessment } from "../../types/assessment/assessment.type";

type SectionArchiveConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  section: Section | null;
  students: Student[];
  assessments: Assessment[];
};

export default function SectionArchiveConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  section,
  students,
  assessments,
}: SectionArchiveConfirmationModalProps): ReactElement {
  if (!isOpen || !section) return <></>;

  const studentCount = getStudentCountForSection(section, students);

  // calculate exclusive assessment count
  const getExclusiveAssessmentCount = (section: Section): number => {
    return assessments.filter(
      (assessment) =>
        assessment.sections.includes(section.id) &&
        assessment.sections.length === 1,
    ).length;
  };

  const exclusiveAssessmentCount = getExclusiveAssessmentCount(section);
  const teacherCount = section.teacherIds.length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Archive Section
        </h3>

        <div className="space-y-3 mb-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to archive <strong>{section.name}</strong>?
          </p>

          {(studentCount > 0 || exclusiveAssessmentCount > 0) && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-sm p-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium mb-2">
                This section contains data that will be preserved:
              </p>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                {studentCount > 0 && (
                  <li>
                    •{" "}
                    <strong>
                      {studentCount} student{studentCount !== 1 ? "s" : ""}
                    </strong>{" "}
                  </li>
                )}
                {exclusiveAssessmentCount > 0 && (
                  <li>
                    •{" "}
                    <strong>
                      {exclusiveAssessmentCount} exclusive assessment
                      {exclusiveAssessmentCount !== 1 ? "s" : ""}
                    </strong>{" "}
                    will be archived
                  </li>
                )}
                {teacherCount > 0 && (
                  <li>
                    •{" "}
                    <strong>
                      {teacherCount} teacher assignment
                      {teacherCount !== 1 ? "s" : ""}
                    </strong>{" "}
                  </li>
                )}
                <li>• All student learning data and progress</li>
                <li>• Assessment results and statistics</li>
              </ul>
            </div>
          )}

          {studentCount === 0 && exclusiveAssessmentCount === 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-sm p-3">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Note:</strong> This section has no students or exclusive
                assessments. Only section information will be archived.
              </p>
            </div>
          )}

          <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-sm p-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>What happens when archiving:</strong>
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mt-1">
              <li>• Section will no longer appear in active lists</li>
              <li>• All student data is preserved</li>
              <li>• Students cannot log in while section is archived</li>
              <li>• Teacher assignments are maintained</li>
              <li>• Exclusive assessments will be archived</li>
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
            Archive Section
          </button>
        </div>
      </div>
    </div>
  );
}
