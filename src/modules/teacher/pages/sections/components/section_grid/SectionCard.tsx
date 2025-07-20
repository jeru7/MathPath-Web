import { type ReactElement } from "react";
import SBanner_1 from "../../../../../../assets/images/section-banners/Banner_1.jpg";
import SBanner_2 from "../../../../../../assets/images/section-banners/Banner_2.jpg";
import SBanner_3 from "../../../../../../assets/images/section-banners/Banner_3.jpg";
import { format } from "date-fns";
import { useParams } from "react-router-dom";
import { Section } from "../../../../../core/types/section/section.type";
import { formatToPhDate } from "../../../../../date/utils/date.util";
import { FaEllipsisH } from "react-icons/fa";
import { useTeacherContext } from "../../../../context/teacher.context";

export default function SectionCard({
  section,
}: {
  section: Section;
}): ReactElement {
  const { teacherId } = useParams();
  const { onlineStudents, students } = useTeacherContext();

  const getOnlineStudentsCount = () => {
    const onlineInSection = onlineStudents.filter((student) =>
      section.studentIds?.includes(student.id),
    );

    return onlineInSection.length;
  };

  const onlineStudentCount = getOnlineStudentsCount();

  const onlinePercentage = students.length
    ? Math.round((onlineStudentCount / students.length) * 100)
    : 0;

  if (!teacherId) {
    return <p>Loading...</p>;
  }
  return (
    <section
      className={`flex flex-col rounded-sm bg-white opacity-90 border-gray-300 border hover:cursor-pointer hover:opacity-100 h-full`}
    >
      <div className={`bg-[var(--${section.color})] h-1 w-full `}></div>
      <div className="flex flex-col gap-1 p-2">
        {/* Banner */}
        <div className="rounded-sm">
          <img
            src={
              section.banner === "SBanner_1"
                ? SBanner_1
                : section.banner === "SBanner_2"
                  ? SBanner_2
                  : SBanner_3
            }
            alt="section banner"
            className="object-contain"
          />
        </div>
        {/* Header */}
        <header className="flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{section.name}</h3>
            <FaEllipsisH className="w-8 hover:scale-105 hover:cursor-pointer" />
          </div>
          <p className="text-[10px] text-[var(--primary-gray)]">{`Last checked on ${format(formatToPhDate(section.lastChecked.toString()), "MMMM d, yyyy")}`}</p>
        </header>
        {/* Section details - Top */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <p className="text-xl font-bold">
              {section.studentIds?.length ?? 0}
            </p>
            <p className="text-xs text-[var(--primary-gray)]">Students</p>
          </div>
          <div className="flex items-baseline gap-1">
            <p className="text-xl font-bold">
              {section.assessmentIds?.length ?? 0}
            </p>
            <p className="text-xs text-[var(--primary-gray)]">Assessments</p>
          </div>
        </div>
        {/* Section details - Bottom */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <p className="">Online</p>
            <p className="">{onlineStudentCount}</p>
          </div>
          {/* Online Bar */}
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
          <p className="text-right text-[10px] text-[var(--primary-gray)]">{`Created on ${format(formatToPhDate(section.createdAt.toString()), "MMMM d, yyyy")}`}</p>
        </div>
      </div>
    </section>
  );
}
