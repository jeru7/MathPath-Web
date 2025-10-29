import { type ReactElement } from "react";
import { format } from "date-fns";
import { Section } from "../../../core/types/section/section.type";
import { formatToPhDate } from "../../../core/utils/date.util";
import { getSectionBanner } from "../../../core/utils/section/section.util";
import { SectionTableContext } from "./SectionTable";

type SectionItemProps = {
  section: Section;
  onClick?: () => void;
  onDelete?: () => void;
  context: SectionTableContext;
};

export default function SectionItem({
  section,
  onClick,
  context,
}: SectionItemProps): ReactElement {
  const { onlineStudents, students, assessments } = context;

  const studentCount = students.filter(
    (student) => student.sectionId === section.id,
  ).length;

  const assessmentCount = assessments.filter((assessment) =>
    assessment?.sections?.includes(section.id),
  ).length;

  const onlineStudentCount = (): number => {
    const onlineInSection = onlineStudents.filter(
      (student) => student.sectionId === section.id,
    );

    return onlineInSection.length;
  };

  const onlinePercentage =
    studentCount > 0
      ? Math.round((onlineStudentCount() / studentCount) * 100)
      : 0;

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <section
      className={`flex flex-col rounded-sm bg-white dark:bg-gray-800 opacity-90 border-gray-300 dark:border-gray-600 border hover:cursor-pointer hover:opacity-100 h-full xl:max-w-[350px] transition-colors duration-200`}
      onClick={handleCardClick}
    >
      <div
        className={`bg-[var(--${section.color})] h-1 w-full rounded-t-md `}
      ></div>
      <div className="flex flex-col justify-between p-2 flex-1">
        {/* banner */}
        <div className="rounded-sm flex items-center justify-center">
          <img
            src={getSectionBanner(section.banner)}
            alt="section banner"
            className="object-contain w-full max-w-[320px]"
          />
        </div>
        {/* header */}
        <header className="flex flex-col">
          <div className="relative flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {section.name}
            </h3>
          </div>
        </header>
        {/* section details */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {studentCount}
            </p>
            <p className="text-xs text-[var(--primary-gray)] dark:text-gray-400">
              Students
            </p>
          </div>
          <div className="flex items-baseline gap-1">
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {assessmentCount}
            </p>
            <p className="text-xs text-[var(--primary-gray)] dark:text-gray-400">
              Assessments
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <p className="text-gray-900 dark:text-gray-100">Online</p>
            <p className="text-gray-900 dark:text-gray-100">
              {onlineStudentCount()}
            </p>
          </div>
          {/* online bar */}
          <div className="relative h-1 rounded-full">
            <div
              className="absolute left-0 top-0 h-full w-full rounded-full opacity-50"
              style={{
                backgroundColor: `var(--${section.color})`,
              }}
            ></div>
            <div
              className="h-full rounded-full"
              style={{
                width: `${onlinePercentage}%`,
                backgroundColor: `var(--${section.color})`,
              }}
            ></div>
          </div>
          <p className="text-right text-[10px] text-[var(--primary-gray)] dark:text-gray-400">{`Created on ${format(formatToPhDate(section.createdAt.toString()), "MMMM d, yyyy")}`}</p>
        </div>
      </div>
    </section>
  );
}
