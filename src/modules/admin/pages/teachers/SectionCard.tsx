import { type ReactElement } from "react";
import { Section } from "../../../core/types/section/section.type";
import { FaCalendar, FaUsers } from "react-icons/fa";
import { format } from "date-fns-tz";
import { TIMEZONE } from "../../../core/constants/date.constant";

type SectionCardProps = {
  section: Section;
  studentCount: number;
};
export default function SectionCard({
  section,
  studentCount,
}: SectionCardProps): ReactElement {
  const teacherCount = section?.teacherIds?.length || 0;

  const getSectionColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      "primary-green": "border-l-green-500",
      "tertiary-green": "border-l-emerald-500",
      "primary-orange": "border-l-orange-500",
      "primary-yellow": "border-l-yellow-500",
    };
    return colorMap[color] || "border-l-gray-500";
  };

  return (
    <div
      key={section.id}
      className={`bg-white dark:bg-gray-800 rounded-sm border-l-4 border border-y-gray-300 border-r-gray-300 dark:border-y-gray-700 dark:border-r-gray-700 ${getSectionColorClass(
        section.color,
      )} border p-4`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">
            {section.name || "Unnamed Section"}
          </h4>
          <div className="w-20 object-contain overflow-hidden rounded-sm">
            <img src={section.banner} alt="Section banner" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <FaUsers className="w-3 h-3" />
            <span>
              {teacherCount} teacher{teacherCount !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaUsers className="w-3 h-3" />
            <span>
              {studentCount} student{studentCount !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaCalendar className="w-3 h-3" />
            <span>
              {format(new Date(section.updatedAt), "MMM d, yyyy", {
                timeZone: TIMEZONE,
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
