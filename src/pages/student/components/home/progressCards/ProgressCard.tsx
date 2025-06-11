import { type ReactElement } from "react";
import HalfCircleProgress from "./HalfCircleProgress";
import { titleEnum } from "../../../../../types/progress-card.type";
import {
  useStudentAssessmentTracker,
  useStudentStagesTracker,
} from "../../../../../hooks/useStudent";

// DONE: Progress Card
export default function ProgressCard({
  title,
  studentId,
}: {
  title: titleEnum;
  studentId: string;
}): ReactElement {
  const { data: assessments } = useStudentAssessmentTracker(studentId);
  const { data: stages } = useStudentStagesTracker(studentId);

  console.log(stages);

  const data = title === titleEnum.Assessment ? assessments : stages;

  return (
    <article className="w-full h-full rounded-md shadow-sm bg-white px-4 py-2 flex flex-col items-center">
      <p className="font-semibold">{title}</p>
      <div className="w-full h-full flex items-center justify-center">
        <HalfCircleProgress percentage={data ? data.completedPercentage : 0} />
      </div>
    </article>
  );
}
