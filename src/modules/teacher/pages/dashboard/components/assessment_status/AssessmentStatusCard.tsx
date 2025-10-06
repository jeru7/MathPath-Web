import { type ReactElement } from "react";
import AssessmentStatusItem from "./AssessmentStatusItem";
import { useParams } from "react-router-dom";
import { useTeacherAssessmentStatus } from "../../../../services/teacher-stats.service";

export default function AssessmentStatusCard({
  classes,
}: {
  classes: string;
}): ReactElement {
  const { teacherId } = useParams();
  const { data: assessmentStatus } = useTeacherAssessmentStatus(
    teacherId ?? "",
  );

  return (
    <article
      className={`${classes} bg-white dark:bg-gray-800 shadow-sm min-h-[300px] lg:h-auto lg:min-h-0 rounded-sm p-2 flex flex-col gap-1 border border-gray-200 dark:border-gray-700 transition-colors duration-200`}
    >
      <header className="">
        <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">
          Assessment Status
        </p>
      </header>

      {assessmentStatus && assessmentStatus?.length > 0 ? (
        <div className="h-[200px] overflow-y-auto">
          <section className="flex flex-col gap-1">
            {assessmentStatus?.map((assessment, index) => (
              <AssessmentStatusItem
                classes=""
                assessmentData={assessment}
                key={index}
              />
            ))}
          </section>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-300 dark:text-gray-500 italic">
            No data available
          </p>
        </div>
      )}
    </article>
  );
}
