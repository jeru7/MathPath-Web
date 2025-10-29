import { type ReactElement, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaChartBar,
  FaClock,
  FaListAlt,
  FaFile,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";
import { Assessment } from "../../../../../core/types/assessment/assessment.type";
import { Student } from "../../../../../student/types/student.type";
import { AssessmentAttempt } from "../../../../../core/types/assessment-attempt/assessment-attempt.type";
import AttemptReviewModal from "../../../../../student/pages/assessments/components/assessment-attempt/AttemptReviewModal";
import AssessmentInformation from "./AssessmentInformation";
import AttemptList from "./AttemptList";
import StatsCard from "../../../../components/details/StatsCard";
import FooterActions from "../../../../../core/components/modal/FooterActions";
import ModalOverlay from "../../../../../core/components/modal/ModalOverlay";

type AssessmentDetailsModalProps = {
  assessment: Assessment;
  isOpen: boolean;
  onClose: () => void;
  studentAttempts?: AssessmentAttempt[];
  students?: Student[];
  isLoadingAttempts?: boolean;
  onEdit?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
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
  isLoadingAttempts = false,
  onEdit,
  onArchive,
  onDelete,
}: AssessmentDetailsModalProps): ReactElement {
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedAttempt, setSelectedAttempt] =
    useState<AssessmentAttempt | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showMobileStats, setShowMobileStats] = useState(false);

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

  // check if assessment is in-progress and cannot be edited
  const cannotEdit = assessment.status === "in-progress";

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
    if (onEdit && !cannotEdit) {
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
        <div className="bg-white border border-white dark:border-gray-700 dark:bg-gray-800 rounded-sm h-[100vh] w-[100vw] md:h-[85vh] md:w-[90vw] lg:w-[75vw] md:max-w-7xl md:max-h-[800px] overflow-hidden flex flex-col">
          {/* header */}
          <header className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-sm">
                <IoDocumentText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 line-clamp-1">
                  {assessment.title || "Untitled Assessment"}
                </h2>
                {/* mobile only stats summary */}
                <div className="sm:hidden flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {safeStudentAttempts.length} attempts
                  </span>
                  <span className="text-xs text-green-600 dark:text-green-400">
                    {averageScore} avg score
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-900 dark:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </header>

          <div className="flex-1 overflow-hidden flex flex-col">
            {/* mobile stats toggle */}
            <div className="sm:hidden border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowMobileStats(!showMobileStats)}
                className="w-full p-3 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Assessment Statistics
                </span>
                {showMobileStats ? (
                  <FaChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <FaChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>

              {/* mobile stats dropdown */}
              <AnimatePresence>
                {showMobileStats && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white dark:bg-gray-800 rounded-sm p-3 border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-sm">
                              <FaFile className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                Total Attempts
                              </p>
                              <p className="text-base font-bold text-gray-900 dark:text-gray-100">
                                {safeStudentAttempts.length}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-sm p-3 border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-sm">
                              <FaChartBar className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                Avg Score
                              </p>
                              <p className="text-base font-bold text-green-600 dark:text-green-400">
                                {averageScore}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-sm p-3 border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-sm">
                              <FaListAlt className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                Questions
                              </p>
                              <p className="text-base font-bold text-purple-600 dark:text-purple-400">
                                {totalQuestions}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-sm p-3 border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-sm">
                              <FaClock className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                Time Limit
                              </p>
                              <p className="text-base font-bold text-orange-600 dark:text-orange-400">
                                {assessment.timeLimit
                                  ? `${assessment.timeLimit}m`
                                  : "No limit"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* desktop stats bar */}
            <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 p-3 lg:p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              <StatsCard
                icon={<FaFile />}
                title="Total Attempts"
                value={safeStudentAttempts.length}
                iconBgColor="bg-blue-100 dark:bg-blue-900/30"
                iconColor="text-blue-600 dark:text-blue-400"
                isLoading={isLoadingAttempts}
              />

              <StatsCard
                icon={<FaChartBar />}
                title="Avg Score"
                value={`${averageScore} points`}
                iconBgColor="bg-green-100 dark:bg-green-900/30"
                iconColor="text-green-600 dark:text-green-400"
                isLoading={isLoadingAttempts}
              />

              <StatsCard
                icon={<FaListAlt />}
                title="Questions"
                value={totalQuestions}
                iconBgColor="bg-purple-100 dark:bg-purple-900/30"
                iconColor="text-purple-600 dark:text-purple-400"
              />

              <StatsCard
                icon={<FaClock />}
                title="Time Limit"
                value={
                  assessment.timeLimit ? `${assessment.timeLimit}m` : "No limit"
                }
                iconBgColor="bg-orange-100 dark:bg-orange-900/30"
                iconColor="text-orange-600 dark:text-orange-400"
              />
            </div>

            {/* main content */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto">
                {/* assessment information */}
                <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                  <AssessmentInformation assessment={assessment} />
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
            disableEdit={cannotEdit}
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
