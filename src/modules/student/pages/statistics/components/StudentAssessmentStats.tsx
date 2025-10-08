import { type ReactElement } from "react";

type StudentAssessmentStatsProps = {
  studentId: string;
};

export default function StudentAssessmentStats({
  studentId,
}: StudentAssessmentStatsProps): ReactElement {
  console.log(studentId);
  return (
    <article className="flex flex-col w-full h-full bg-inherit p-3">
      <header>
        <h3 className="font-semibold text-gray-900 dark:text-gray-200">
          Assessments
        </h3>
      </header>
    </article>
  );
}
