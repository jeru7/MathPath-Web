import { ReactElement } from "react";
import "../../../../core/styles/customTable.css";
import { format } from "date-fns-tz";
import { Student } from "../../../types/student.type";
import { Assessment } from "../../../../core/types/assessment/assessment.type";
import { useAssessmentAttempt } from "../../../services/student-assessment-attempt.service";
import {
  getAssessmentStatus,
  getTotalAttemptsCount,
} from "../../../utils/assessments/assessment.util";

type AssessmentTableItemProps = {
  assessment: Assessment;
  student: Student | null | undefined;
  onAssessmentClick: (assessment: Assessment) => void;
};

export default function AssessmentTableItem({
  assessment,
  student,
  onAssessmentClick,
}: AssessmentTableItemProps): ReactElement {
  const totalQuestions = assessment.pages.reduce((total, page) => {
    const questionCount = page.contents.filter(
      (content) => content.type === "question",
    ).length;
    return total + questionCount;
  }, 0);

  const { data: attempts = [] } = useAssessmentAttempt(
    student?.id || "",
    assessment.id,
  );

  const totalAttempts = getTotalAttemptsCount(attempts);

  const studentStatus = getAssessmentStatus(assessment);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "expired":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      case "not-available":
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Available";
      case "expired":
        return "Expired";
      case "not-available":
        return "Not Available";
      default:
        return "Not Available";
    }
  };

  return (
    <tr
      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
      onClick={() => onAssessmentClick(assessment)}
    >
      <td className="w-[20%]">
        <div>
          <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
            {assessment.title || "Untitled Assessment"}
          </p>
        </div>
      </td>
      <td className="w-[20%]">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {assessment.topic || "No topic"}
        </p>
      </td>
      <td className="w-[10%] text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {assessment.date.end
            ? format(new Date(assessment.date.end), "MMM d 'at' h:mm a", {
                timeZone: "Asia/Manila",
              })
            : "N/A"}
        </p>
      </td>
      <td className="w-[10%] text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {assessment.timeLimit ? `${assessment.timeLimit} mins` : "No limit"}
        </p>
      </td>
      <td className="w-[10%] text-center">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusVariant(studentStatus)}`}
        >
          {getStatusText(studentStatus)}
        </span>
      </td>
      <td className="w-[10%] text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {totalQuestions}
        </p>
      </td>
      <td className="w-[10%] text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {totalAttempts}/{assessment.attemptLimit || "∞"}
        </p>
      </td>
    </tr>
  );
}
