import { type ReactElement } from "react";
import HalfCircleProgress from "./HalfCircleProgress";
import { ProgressType } from "../../../../core/types/progress_card.types";
import {
  useStudentAssessmentTracker,
  useStudentStagesTracker,
} from "../../../hooks/useStudentStats";

export default function ProgressCard({
  title,
  studentId,
}: {
  title: ProgressType;
  studentId: string;
}): ReactElement {
  const { data: assessments } = useStudentAssessmentTracker(studentId);
  const { data: stages } = useStudentStagesTracker(studentId);

  console.log(stages);

  const data = title === "Assessment" ? assessments : stages;

  return (
    <article className="w-full h-full rounded-md shadow-sm bg-white px-4 py-2 flex flex-col items-center">
      <p className="font-semibold">{title}</p>
      <div className="w-full h-full flex items-center justify-center">
        <HalfCircleProgress percentage={data ? data.completedPercentage : 0} />
      </div>
    </article>
  );
}
