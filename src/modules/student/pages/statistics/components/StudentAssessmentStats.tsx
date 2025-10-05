import { type ReactElement } from "react";

type StudentAssessmentStatsProps = {
  studentId: string;
};

export default function StudentAssessmentStats({
  studentId,
}: StudentAssessmentStatsProps): ReactElement {
  return (
    <article className="flex flex-col w-full h-full bg-white rounded-sm p-3">
      <header>
        <h3 className="font-semibold text-gray-900">Assessments</h3>
      </header>
    </article>
  );
}
