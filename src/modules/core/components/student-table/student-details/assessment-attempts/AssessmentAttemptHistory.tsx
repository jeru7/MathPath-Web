import { useMemo, type ReactElement } from "react";
import { IoDocumentText } from "react-icons/io5";
import AssessmentAttemptItem from "./AssessmentAttemptItem";
import { AttemptWithAssessment } from "../StudentDetailsModal";
import { Student } from "../../../../../student/types/student.type";
import { useStudentAssessments } from "../../../../../student/services/student-assessment.service";
import { useAssessmentsAttempts } from "../../../../../student/services/student-assessment-attempt.service";

type AssessmentAttemptHistoryProps = {
  student: Student;
};

export default function AssessmentAttemptHistory({
  student,
}: AssessmentAttemptHistoryProps): ReactElement {
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
    <div className="bg-inherit rounded-sm">
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
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 h-64 flex flex-col justify-center items-center">
          <IoDocumentText className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
          <p>No assessment attempts found</p>
        </div>
      ) : (
        <div className="h-64 overflow-y-auto pr-2">
          <div className="space-y-3">
            {sortedAttempts.map((attempt) => (
              <AssessmentAttemptItem
                key={attempt.id}
                attempt={attempt}
                student={student}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
