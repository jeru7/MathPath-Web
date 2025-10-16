import { type ReactElement, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaChartBar,
  FaClock,
  FaListAlt,
  FaFile,
} from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";
import { Assessment } from "../../../../../core/types/assessment/assessment.type";
import { Student } from "../../../../../student/types/student.type";
import { AssessmentAttempt } from "../../../../../core/types/assessment-attempt/assessment-attempt.type";
import AttemptReviewModal from "../../../../../student/pages/assessments/components/assessment-attempt/AttemptReviewModal";
import AssessmentInformation from "./AssessmentInformation";
import AttemptList from "./AttemptList";
import StatsCard from "../../../../components/details/StatsCard";

type AssessmentDetailsModalProps = {
  assessment: Assessment;
  isOpen: boolean;
  onClose: () => void;
  studentAttempts?: AssessmentAttempt[];
  students?: Student[];
  isLoadingAttempts?: boolean;
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

  if (!assessment) return <div>Loading...</div>;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white border border-white dark:border-gray-700 dark:bg-gray-800 rounded-sm w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {/* header */}
            <header className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-sm">
                  <IoDocumentText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {assessment.title || "Untitled Assessment"}
                  </h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 hover:cursor-pointer"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </header>

            <div className="flex-1 overflow-hidden flex flex-col">
              {/* quick stats bar */}
              <div className="grid grid-cols-4 gap-4 p-6 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
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
                    assessment.timeLimit
                      ? `${assessment.timeLimit}m`
                      : "No limit"
                  }
                  iconBgColor="bg-orange-100 dark:bg-orange-900/30"
                  iconColor="text-orange-600 dark:text-orange-400"
                />
              </div>

              {/* main content */}
              <div className="flex-1 grid grid-cols-3 gap-6 p-6 overflow-hidden">
                {/* left column: assessment details */}
                <div className="col-span-1 space-y-6">
                  <AssessmentInformation assessment={assessment} />
                </div>

                {/* right column: student attempts */}
                <div className="col-span-2 flex flex-col h-full">
                  <AttemptList
                    students={students}
                    assessment={assessment}
                    onReview={handleReviewAttempt}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* review modal */}
      <AttemptReviewModal
        isOpen={reviewModalOpen}
        assessment={assessment}
        attempt={selectedAttempt}
        student={selectedStudent}
        onClose={handleCloseReviewModal}
      />
    </AnimatePresence>
  );
}
