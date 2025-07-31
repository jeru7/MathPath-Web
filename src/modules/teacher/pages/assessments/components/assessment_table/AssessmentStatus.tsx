import { type ReactElement } from "react";
import { AssessmentStatus as Status } from "../../../../../core/types/assessment/assessment.type";

type AssessmentStatusProps = {
  status: Status;
};
export default function AssessmentStatus({
  status,
}: AssessmentStatusProps): ReactElement {
  return (
    <div
      className={`flex gap-1 items-center w-fit border rounded-full py-1 px-3 ${
        status === "finished"
          ? "text-[var(--primary-green)]"
          : status === "in-progress"
            ? "text-[var(--secondary-green)]"
            : "text-[var(--primary-yellow)]"
      }`}
    >
      <p>
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
