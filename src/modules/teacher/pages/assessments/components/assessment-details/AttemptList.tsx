import { useMemo, useState, type ReactElement } from "react";
import { FaUserGraduate } from "react-icons/fa";
import AttemptItem from "./AttemptItem";
import { AssessmentAttempt } from "../../../../../core/types/assessment-attempt/assessment-attempt.type";
import {
  Student,
  StudentAssessment,
} from "../../../../../student/types/student.type";
import { Assessment } from "../../../../../core/types/assessment/assessment.type";
import { format } from "date-fns-tz";
import { useTeacherContext } from "../../../../context/teacher.context";
import { useTeacherAssessmentAttempts } from "../../../../services/teacher-assessment-attempt.service";

type AttemptListProps = {
  students?: Student[];
  assessment: Assessment;
  onReview: (attempt: AttemptWithStudent) => void;
};

type AttemptWithStudent = AssessmentAttempt & {
  student: Student;
};

export default function AttemptList({
  students,
  assessment,
  onReview,
}: AttemptListProps): ReactElement {
  const { teacherId } = useTeacherContext();
  const { data: attempts, isLoading } = useTeacherAssessmentAttempts(
    teacherId,
    assessment.id,
  );
  const [expandedAttempt, setExpandedAttempt] = useState<string | null>(null);

  const safeStudentAttempts = useMemo(() => {
    if (!attempts) return [];
    if (Array.isArray(attempts)) return attempts;
    return [];
  }, [attempts]);

  const safeSectionStudents = useMemo(() => {
    if (!students) return [];
    if (Array.isArray(students)) return students;
    console.warn("students is not an array:", students);
    return [];
  }, [students]);

  // get all students assigned to this assessment
  const assignedStudents = useMemo(() => {
    return safeSectionStudents.filter((student) =>
      student.assessments?.some(
        (studentAssessment: StudentAssessment) =>
          studentAssessment.assessmentId === assessment.id,
      ),
    );
  }, [safeSectionStudents, assessment.id]);

  const attemptsWithStudents = useMemo((): AttemptWithStudent[] => {
    if (isLoading) return [];
    return safeStudentAttempts
      .map((attempt) => {
        const student = safeSectionStudents.find(
          (s) => s.id === attempt.studentId,
        );
        return student ? { ...attempt, student } : null;
      })
      .filter(Boolean) as AttemptWithStudent[];
  }, [safeStudentAttempts, safeSectionStudents, isLoading]);

  const allAttemptsSorted = useMemo(() => {
    if (isLoading) return [];
    return attemptsWithStudents.sort(
      (a, b) =>
        new Date(b.dateUpdated).getTime() - new Date(a.dateUpdated).getTime(),
    );
  }, [attemptsWithStudents, isLoading]);

  const toggleAttempt = (attemptId: string) => {
    setExpandedAttempt(expandedAttempt === attemptId ? null : attemptId);
  };

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy 'at' hh:mm a", {
        timeZone: "Asia/Manila",
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
      <div className="p-5 border-b border-gray-200 rounded-t-sm dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-sm">
              <FaUserGraduate className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Student Attempts
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-4 w-48 rounded"></div>
                ) : (
                  `${assignedStudents.length} ${assignedStudents.length > 1 ? "students" : "student"} • ${allAttemptsSorted?.length} total attempts`
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* list */}
      <div className="flex-1 p-4 overflow-y-auto">
        {isLoading ? (
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
                key={`${attempt.id}`}
                attempt={attempt}
                passingScore={assessment.passingScore || 0}
                formatDuration={formatDuration}
                formatTimeSpent={formatTimeSpent}
                formatDate={formatDate}
                isExpanded={expandedAttempt === attempt.id}
                onToggle={() => toggleAttempt(attempt.id || "")}
                onReview={() => onReview(attempt)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
