import { type ReactElement, useMemo, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";
import { Assessment } from "../../../../../core/types/assessment/assessment.type";
import { Student } from "../../../../../student/types/student.type";
import { AssessmentAttempt } from "../../../../../core/types/assessment-attempt/assessment-attempt.type";
import AttemptReviewModal from "../../../../../student/pages/assessments/components/assessment-attempt/AttemptReviewModal";
import AssessmentInformation from "./AssessmentInformation";
import AttemptList from "./AttemptList";
import FooterActions from "../../../../../core/components/modal/FooterActions";
import ModalOverlay from "../../../../../core/components/modal/ModalOverlay";

type AssessmentDetailsModalProps = {
  assessment: Assessment;
  isOpen: boolean;
  onClose: () => void;
  studentAttempts?: AssessmentAttempt[];
  students?: Student[];
  onEdit?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  disableEdit?: boolean;
  archiveLabel?: string;
};

type AttemptWithStudent = AssessmentAttempt & {
  student: Student;
};

export default function AssessmentDetailsModal({
  assessment,
  isOpen,
  onClose,
  studentAttempts,
  students,
  onEdit,
  onArchive,
  onDelete,
  archiveLabel = "Archive",
}: AssessmentDetailsModalProps): ReactElement {
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedAttempt, setSelectedAttempt] =
    useState<AssessmentAttempt | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const safeStudentAttempts = useMemo(() => {
    if (!studentAttempts) return [];
    if (Array.isArray(studentAttempts)) return studentAttempts;
    console.warn("studentAttempts is not an array:", studentAttempts);
    return [];
  }, [studentAttempts]);

  const totalQuestions = useMemo(() => {
    return (
      assessment?.pages?.reduce((total, page) => {
        const questionCount = page.contents.filter(
          (content) => content.type === "question",
        ).length;
        return total + questionCount;
      }, 0) || 0
    );
  }, [assessment]);

  const averageScore = useMemo(() => {
    if (safeStudentAttempts.length === 0) return 0;
    const totalScore = safeStudentAttempts.reduce((sum, attempt) => {
      const score = attempt.score || 0;
      return sum + score;
    }, 0);
    return Math.round(totalScore / safeStudentAttempts.length);
  }, [safeStudentAttempts]);

  // calculate student count for this assessment
  const studentCount = useMemo(() => {
    if (!students || !assessment.sections) return 0;
    return students.filter((student) =>
      assessment.sections.includes(student.sectionId),
    ).length;
  }, [students, assessment.sections]);

  const handleReviewAttempt = (attempt: AttemptWithStudent) => {
    setSelectedAttempt(attempt);
    setSelectedStudent(attempt.student);
    setReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setReviewModalOpen(false);
    setSelectedAttempt(null);
    setSelectedStudent(null);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    }
  };

  const handleArchive = () => {
    if (onArchive) {
      onArchive();
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  if (!assessment) return <div>Loading...</div>;

  return (
    <>
      <ModalOverlay isOpen={isOpen} onClose={onClose}>
        <div className="bg-white border border-white dark:border-gray-700 dark:bg-gray-800 rounded-sm h-[100dvh] w-[100dvw] md:h-[85dvh] md:w-[90dvw] overflow-hidden flex flex-col">
          {/* header */}
          <header className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-sm">
                <IoDocumentText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 line-clamp-1">
                  {assessment.title || "Untitled Assessment"}
                </h2>
                {assessment.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mt-1">
                    {assessment.description}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-900 dark:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 flex-shrink-0"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </header>

          <div className="flex-1 overflow-hidden flex flex-col">
            {/* main content */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto">
                {/* assessment information */}
                <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                  <AssessmentInformation
                    assessment={assessment}
                    totalQuestions={totalQuestions}
                    averageScore={averageScore}
                    studentCount={studentCount}
                  />
                </div>

                {/* student attempts list */}
                <div className="flex-1 p-4 sm:p-6">
                  <AttemptList
                    students={students}
                    assessment={assessment}
                    onReview={handleReviewAttempt}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* action buttons */}
          <FooterActions
            lastUpdated={assessment?.updatedAt}
            onEdit={handleEdit}
            onArchive={handleArchive}
            onDelete={handleDelete}
            archiveLabel={archiveLabel}
          />
        </div>
      </ModalOverlay>

      {/* review modal */}
      <AttemptReviewModal
        isOpen={reviewModalOpen}
        assessment={assessment}
        attempt={selectedAttempt}
        student={selectedStudent}
        onClose={handleCloseReviewModal}
      />
    </>
  );
}
