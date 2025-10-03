import { ReactElement } from "react";
import { Assessment } from "../../../../core/types/assessment/assessment.type";
import "../../../../core/styles/customTable.css";
import { format } from "date-fns-tz";

type AssessmentTableItemProps = {
  assessment: Assessment;
};

export default function AssessmentTableItem({
  assessment,
}: AssessmentTableItemProps): ReactElement {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="w-[20%]">
        <div>
          <p className="font-medium text-sm">
            {assessment.title || "Untitled Assessment"}
          </p>
        </div>
      </td>
      <td className="w-[20%]">
        <p className="text-sm">{assessment.topic || "No topic"}</p>
      </td>
      <td className="w-[10%] text-center">
        <p className="text-sm">
          {assessment.date.end
            ? format(new Date(assessment.date.end), "MMM d 'at' h:mm a", {
                timeZone: "Asia/Manila",
              })
            : "N/A"}
        </p>
      </td>
      <td className="w-[10%] text-center">
        <p className="text-sm">
          {assessment.timeLimit ? `${assessment.timeLimit} mins` : "No limit"}
        </p>
      </td>
      <td className="w-[10%] text-center">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        `}
        >
          Not Started
        </span>
      </td>
      <td className="w-[10%] text-center">
        <p className="text-sm">
          {assessment.pages.reduce((total, page) => {
            const questionCount = page.contents.filter(
              (content) => content.type === "question",
            ).length;
            return total + questionCount;
          }, 0)}
        </p>
      </td>
      <td className="w-[10%] text-center">
        <p className="text-sm">0/{assessment.attemptLimit} </p>
      </td>
      <td className="w-[5%] text-center">
        <button className="text-[var(--primary-green)] hover:text-[var(--primary-green-dark)] text-sm font-medium"></button>
      </td>
    </tr>
  );
}
