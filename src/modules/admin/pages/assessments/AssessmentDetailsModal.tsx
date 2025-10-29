import { type ReactElement, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaChartBar,
  FaClock,
  FaListAlt,
  FaFile,
  FaUserGraduate,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";
import { format } from "date-fns-tz";
import { Assessment } from "../../../core/types/assessment/assessment.type";
import { Student } from "../../../student/types/student.type";
import { Teacher } from "../../../teacher/types/teacher.type";
import { AssessmentAttempt } from "../../../core/types/assessment-attempt/assessment-attempt.type";
import AttemptReviewModal from "../../../student/pages/assessments/components/assessment-attempt/AttemptReviewModal";
import StatsCard from "../../../teacher/components/details/StatsCard";
import AssessmentInformation from "./AssessmentInformation";
import AttemptItem from "./AttemptItem";
import ModalOverlay from "../../../core/components/modal/ModalOverlay";
import { TIMEZONE } from "../../../core/constants/date.constant";

type AssessmentDetailsModalProps = {
  assessment: Assessment;
  isOpen: boolean;
  onClose: () => void;
  studentAttempts?: AssessmentAttempt[];
  students?: Student[];
  teacher?: Teacher;
  isLoadingAttempts?: boolean;
};

export type AttemptWithStudent = AssessmentAttempt & {
  student: Student;
};

export default function AssessmentDetailsModal({
  assessment,
  isOpen,
  onClose,
  studentAttempts,
  students,
  teacher,
  isLoadingAttempts = false,
}: AssessmentDetailsModalProps): ReactElement {
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedAttempt, setSelectedAttempt] =
    useState<AssessmentAttempt | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [expandedAttempt, setExpandedAttempt] = useState<string | null>(null);
  const [showMobileStats, setShowMobileStats] = useState(false);

  const safeStudentAttempts = useMemo(() => {
    if (!studentAttempts) return [];
    if (Array.isArray(studentAttempts)) return studentAttempts;
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

  const attemptsWithStudents = useMemo((): AttemptWithStudent[] => {
    if (isLoadingAttempts) return [];
    return safeStudentAttempts
      .map((attempt) => {
        const student = students?.find((s) => s.id === attempt.studentId);
        return student ? { ...attempt, student } : null;
      })
      .filter(Boolean) as AttemptWithStudent[];
  }, [safeStudentAttempts, students, isLoadingAttempts]);

  const allAttemptsSorted = useMemo(() => {
    if (isLoadingAttempts) return [];
    return attemptsWithStudents.sort(
      (a, b) =>
        new Date(b.dateUpdated).getTime() - new Date(a.dateUpdated).getTime(),
    );
  }, [attemptsWithStudents, isLoadingAttempts]);

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

  const toggleAttempt = (attemptId: string) => {
    setExpandedAttempt(expandedAttempt === attemptId ? null : attemptId);
  };

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy 'at' hh:mm a", {
        timeZone: TIMEZONE,
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const formatDuration = (seconds: number): string => {
    if (!seconds || seconds === 0) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes === 0) {
      return `${remainingSeconds}s`;
    } else if (remainingSeconds === 0) {
      return `${minutes}m`;
    } else {
      return `${minutes}m ${remainingSeconds}s`;
    }
  };

  const formatTimeSpent = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  if (!assessment) return <div>Loading...</div>;

  return (
    <>
      <ModalOverlay isOpen={isOpen} onClose={onClose}>
        <div className="bg-white border border-white dark:border-gray-700 dark:bg-gray-800 rounded-sm h-[100svh] w-[100svw] md:h-[85svh] md:w-[90svw] lg:w-[75svw] md:max-w-7xl md:max-h-[800px] overflow-hidden flex flex-col">
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
                {teacher && (
                  <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    <span>
                      Created by: {teacher.firstName} {teacher.lastName}
                    </span>
                  </div>
                )}
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
                                {isLoadingAttempts ? (
                                  <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-4 w-8 rounded"></div>
                                ) : (
                                  safeStudentAttempts.length
                                )}
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
                              <p className="text-base font-bold text-gray-900 dark:text-gray-100">
                                {isLoadingAttempts ? (
                                  <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-4 w-12 rounded"></div>
                                ) : (
                                  `${averageScore} pts`
                                )}
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
                              <p className="text-base font-bold text-gray-900 dark:text-gray-100">
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
                              <p className="text-base font-bold text-gray-900 dark:text-gray-100">
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

            {/* main content - scrollable part */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto">
                {/* assessment information */}
                <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                  {teacher && (
                    <AssessmentInformation
                      teacher={teacher}
                      assessment={assessment}
                    />
                  )}
                </div>

                {/* student attempts */}
                <div className="p-4 sm:p-6 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
                    <div className="p-4 sm:p-5 border-b border-gray-200 rounded-t-sm dark:border-gray-700 bg-white dark:bg-gray-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-sm">
                            <FaUserGraduate className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                              Student Attempts
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                              {isLoadingAttempts ? (
                                <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-3 w-32 rounded"></div>
                              ) : (
                                `${allAttemptsSorted.length} total attempts`
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* attempts list */}
                    <div className="flex-1 p-3 sm:p-4 min-h-96 max-h-96 overflow-y-auto">
                      {isLoadingAttempts ? (
                        <div className="flex items-center justify-center h-32">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-2"></div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Loading student attempts...
                            </p>
                          </div>
                        </div>
                      ) : allAttemptsSorted.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <h4 className="text-sm text-gray-900 dark:text-gray-500 mb-2">
                              No Attempt Data
                            </h4>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {allAttemptsSorted.map((attempt) => (
                            <AttemptItem
                              key={attempt.id}
                              attempt={attempt}
                              passingScore={assessment.passingScore || 0}
                              formatDuration={formatDuration}
                              formatTimeSpent={formatTimeSpent}
                              formatDate={formatDate}
                              isExpanded={expandedAttempt === attempt.id}
                              onToggle={() => toggleAttempt(attempt.id || "")}
                              onReview={() => handleReviewAttempt(attempt)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
