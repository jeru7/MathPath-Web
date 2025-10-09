import { type ReactElement } from "react";
import { AssessmentStatus as Status } from "../../../../../core/types/assessment/assessment.type";

type AssessmentStatusProps = {
  status: Status | undefined;
};
export default function AssessmentStatus({
  status,
}: AssessmentStatusProps): ReactElement {
  return (
    <div
      className={`flex gap-1 items-center w-fit rounded-full py-1 px-3 ${
        status === "finished"
          ? "bg-[var(--primary-green)] dark:bg-green-800"
          : status === "in-progress" || status === "published"
            ? "bg-[var(--secondary-green)] dark:bg-green-700"
            : "bg-[var(--primary-yellow)] dark:bg-yellow-600"
      }`}
    >
      <p className="text-white font-semibold dark:text-gray-100">
        {status === "finished"
          ? "Finished"
          : status === "in-progress"
            ? "In-Progress"
            : status === "published"
              ? "Published"
              : "Draft"}
      </p>
    </div>
  );
}
