import { ReactElement } from "react";
import { Assessment } from "../../../../core/types/assessment/assessment.type";
import "../../../../core/styles/customTable.css";
import { format } from "date-fns-tz";

type AssessmentTableItemProps = {
  assessment: Assessment;
  onAssessmentClick: (assessment: Assessment) => void;
};

export default function AssessmentTableItem({
  assessment,
  onAssessmentClick,
}: AssessmentTableItemProps): ReactElement {
  const totalQuestions = assessment.pages.reduce((total, page) => {
    const questionCount = page.contents.filter(
      (content) => content.type === "question",
    ).length;
    return total + questionCount;
  }, 0);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "in-progress":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "failed":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
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
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusVariant("not-started")}`}
        >
          Not Started
        </span>
      </td>
      <td className="w-[10%] text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {totalQuestions}
        </p>
      </td>
      <td className="w-[10%] text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          0/{assessment.attemptLimit}
        </p>
      </td>
    </tr>
  );
}
