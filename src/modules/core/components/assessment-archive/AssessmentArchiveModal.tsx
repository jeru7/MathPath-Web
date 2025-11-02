import { type ReactElement, useState } from "react";
import { IoClose } from "react-icons/io5";
import AssessmentArchiveList from "./AssessmentArchiveList";
import { Assessment } from "../../types/assessment/assessment.type";
import { Student } from "../../../student/types/student.type";
import { AssessmentAttempt } from "../../types/assessment-attempt/assessment-attempt.type";
import ModalOverlay from "../modal/ModalOverlay";
import AssessmentDetailsModal from "../../../teacher/pages/assessments/components/assessment-details/AssessmentDetailsModal";

type AssessmentArchiveModalProps = {
  isOpen: boolean;
  onClose: () => void;
  assessments: Assessment[];
  onRestoreAssessment: (assessmentId: string) => void;
  onDeleteAssessment: (assessmentId: string) => void;
  students?: Student[];
  studentAttempts?: AssessmentAttempt[];
};

export default function AssessmentArchiveModal({
  isOpen,
  onClose,
  assessments,
  onRestoreAssessment,
  onDeleteAssessment,
  students = [],
  studentAttempts = [],
}: AssessmentArchiveModalProps): ReactElement {
  const [selectedAssessment, setSelectedAssessment] =
    useState<Assessment | null>(null);

  const handleAssessmentClick = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
  };

  const handleCloseDetailsModal = () => {
    setSelectedAssessment(null);
  };

  const handleRestore = () => {
    if (selectedAssessment) {
      onRestoreAssessment(selectedAssessment.id);
      setSelectedAssessment(null);
    }
  };

  const handleDelete = () => {
    if (selectedAssessment) {
      onDeleteAssessment(selectedAssessment.id);
      setSelectedAssessment(null);
    }
  };

  // filter student attempts for the selected assessment
  const getStudentAttemptsForAssessment = (assessmentId: string) => {
    return studentAttempts.filter(
      (attempt) => attempt.assessmentId === assessmentId,
    );
  };

  return (
    <>
      <ModalOverlay isOpen={isOpen} onClose={onClose}>
        <div className="bg-white dark:bg-gray-800 rounded-sm border border-white dark:border-gray-700 h-[100svh] w-[100svw] md:h-[85svh] md:w-[90svw] lg:w-[75svw] md:max-w-7xl md:max-h-[800px] overflow-hidden flex flex-col">
          {/* header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                Archived Assessments
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {assessments.length} archived assessment
                {assessments.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-900 dark:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 ml-4"
            >
              <IoClose className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6">
              <AssessmentArchiveList
                assessments={assessments}
                onAssessmentClick={handleAssessmentClick}
              />
            </div>
          </div>

          {/* footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50 flex-shrink-0">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Select an assessment to view details or restore
              </p>
            </div>
          </div>
        </div>
      </ModalOverlay>

      {/* assessment details modal for archived assessments */}
      {selectedAssessment && (
        <AssessmentDetailsModal
          assessment={selectedAssessment}
          isOpen={!!selectedAssessment}
          onClose={handleCloseDetailsModal}
          studentAttempts={getStudentAttemptsForAssessment(
            selectedAssessment.id,
          )}
          students={students}
          onArchive={handleRestore}
          onDelete={handleDelete}
          disableEdit={true}
          archiveLabel="Restore"
        />
      )}
    </>
  );
}
