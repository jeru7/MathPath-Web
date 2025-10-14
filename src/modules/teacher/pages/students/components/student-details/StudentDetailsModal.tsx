import { type ReactElement, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoDocumentText } from "react-icons/io5";
import { Student } from "../../../../../student/types/student.type";
import StatsOverviewCard from "../../../../../student/pages/statistics/components/StatsOverviewCard";
import StudentHeatmap from "../../../../../student/pages/statistics/components/StudentHeatmap";
import StudentTopicStats from "../../../../../student/pages/statistics/components/StudentTopicStats";
import StudentStageStats from "../../../../../student/pages/statistics/components/StudentStageStats";
import StudentQuestionStats from "../../../../../student/pages/statistics/components/StudentQuestionStats";
import { AssessmentAttempt } from "../../../../../core/types/assessment-attempt/assessment-attempt.type";
import { Assessment } from "../../../../../core/types/assessment/assessment.type";
import { useStudentAssessments } from "../../../../../student/services/student-assessment.service";
import { useAssessmentsAttempts } from "../../../../../student/services/student-assessment-attempt.service";
import { FaTimes } from "react-icons/fa";
import DetailsOverview from "./DetailsOverview";
import AssessmentAttemptItem from "./AssessmentAttemptItem";

type StudentDetailsModalProps = {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
};

export type AttemptWithAssessment = AssessmentAttempt & {
  assessmentTitle: string | null;
  assessmentPassingScore: number;
  assessmentData: Assessment | null;
};

export default function StudentDetailsModal({
  student,
  isOpen,
  onClose,
}: StudentDetailsModalProps): ReactElement {
  const { data: assessments = [], isLoading: isLoadingAssessments } =
    useStudentAssessments(student?.id || "");
  const { data: attempts = [], isLoading: isLoadingAttempts } =
    useAssessmentsAttempts(student?.id || "");

  // combine assessment data with attempts
  const allAttempts = useMemo((): AttemptWithAssessment[] => {
    return attempts.map((attempt) => {
      // find the assessment that matches this attempt
      const assessment = assessments.find((a) => a.id === attempt.assessmentId);

      return {
        ...attempt,
        assessmentTitle: assessment?.title || "Untitled Assessment",
        assessmentPassingScore: assessment?.passingScore || 0,
        assessmentData: assessment || null,
      };
    });
  }, [attempts, assessments]);

  const sortedAttempts = useMemo(() => {
    return [...allAttempts].sort((a, b) => {
      const dateA = new Date(a.dateCompleted || a.dateUpdated);
      const dateB = new Date(b.dateCompleted || b.dateUpdated);
      return dateB.getTime() - dateA.getTime();
    });
  }, [allAttempts]);

  const isLoading = isLoadingAssessments || isLoadingAttempts;

  return (
    <>
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
              className="bg-white border border-white dark:border-gray-700 dark:bg-gray-800 rounded-sm w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* header */}
              <header className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Student Card
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-900 dark:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </header>

              <div className="flex-1 overflow-y-auto p-6">
                {/* student details & stats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  <div className="bg-inherit p-4 rounded-sm border border-gray-300 dark:border-gray-700">
                    <DetailsOverview student={student} />
                  </div>

                  {/* stats overview */}
                  <div className="bg-inherit rounded-sm border border-gray-300 dark:border-gray-700">
                    <StatsOverviewCard student={student} />
                  </div>
                </div>

                {/* charts */}
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div className="col-span-1 border border-gray-300 dark:border-gray-700">
                    <StudentHeatmap studentId={student.id} />
                  </div>
                  <div className="col-span-1 border border-gray-300 dark:border-gray-700">
                    <StudentTopicStats studentId={student.id} />
                  </div>
                  <div className="col-span-1 border border-gray-300 dark:border-gray-700">
                    <StudentStageStats studentId={student.id} />
                  </div>
                  <div className="col-span-1 border border-gray-300 dark:border-gray-700">
                    <StudentQuestionStats studentId={student.id} />
                  </div>
                </div>

                {/* assessments list */}
                <div className="">
                  <div className="bg-inherit border border-gray-300 dark:border-gray-700 p-4 rounded-sm">
                    <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <IoDocumentText className="w-5 h-5" />
                      Assessment Attempts ({sortedAttempts.length})
                    </h3>

                    {isLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 dark:border-green-400 mx-auto mb-2"></div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Loading assessments...
                        </p>
                      </div>
                    ) : sortedAttempts.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <IoDocumentText className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                        <p>No assessment attempts found</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {sortedAttempts.map((attempt) => (
                          <AssessmentAttemptItem
                            attempt={attempt}
                            student={student}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
