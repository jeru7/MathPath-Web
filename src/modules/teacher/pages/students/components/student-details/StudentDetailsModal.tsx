import { type ReactElement } from "react";
import { Student } from "../../../../../student/types/student.type";
import StatsOverviewCard from "../../../../../student/pages/statistics/components/StatsOverviewCard";
import StudentHeatmap from "../../../../../student/pages/statistics/components/StudentHeatmap";
import StudentTopicStats from "../../../../../student/pages/statistics/components/StudentTopicStats";
import StudentStageStats from "../../../../../student/pages/statistics/components/StudentStageStats";
import StudentQuestionStats from "../../../../../student/pages/statistics/components/StudentQuestionStats";
import { AssessmentAttempt } from "../../../../../core/types/assessment-attempt/assessment-attempt.type";
import { Assessment } from "../../../../../core/types/assessment/assessment.type";
import { FaTimes } from "react-icons/fa";
import DetailsOverview from "./DetailsOverview";
import AttemptHistory from "./stage-attempts/AttemptHistory";
import AssessmentAttemptHistory from "./assessment-attempts/AssessmentAttemptHistory";
import ModalOverlay from "../../../../../core/components/modal/ModalOverlay";

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
  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div className="bg-white border border-white dark:border-gray-700 dark:bg-gray-800 rounded-sm w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
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

          {/* stage attempts history */}
          <div className="mb-4">
            <div className="bg-inherit border border-gray-300 dark:border-gray-700 p-4 rounded-sm">
              <AttemptHistory student={student} />
            </div>
          </div>

          {/* assessments list */}
          <div className="">
            <div className="bg-inherit border border-gray-300 dark:border-gray-700 p-4 rounded-sm">
              <AssessmentAttemptHistory student={student} />
            </div>
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
}
