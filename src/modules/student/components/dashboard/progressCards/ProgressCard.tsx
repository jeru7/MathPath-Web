import { type ReactElement } from "react";
import HalfCircleProgress from "./HalfCircleProgress";
import { ProgressType } from "../../../../core/types/progress-card.type";
import {
  useStudentAssessmentTracker,
  useStudentStageTracker,
} from "../../../services/student-tracker.service";

export default function ProgressCard({
  title,
  studentId,
}: {
  title: ProgressType;
  studentId: string;
}): ReactElement {
  const { data: assessments } = useStudentAssessmentTracker(studentId);
  const { data: stages } = useStudentStageTracker(studentId);

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
