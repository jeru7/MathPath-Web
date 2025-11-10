import { type ReactElement } from "react";
import { Section } from "../../../core/types/section/section.type";
import { FaCalendar, FaUsers } from "react-icons/fa";
import { format } from "date-fns-tz";
import { TIMEZONE } from "../../../core/constants/date.constant";
import { getSectionBanner } from "../../../core/utils/section/section.util";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <Card className={`border-l-4 ${getSectionColorClass(section.color)} p-4`}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground text-base mb-2 line-clamp-2">
            {section.name || "Unnamed Section"}
          </h4>
          <div className="w-20 object-contain overflow-hidden rounded-sm">
            <img src={getSectionBanner(section.banner)} alt="Section banner" />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="flex items-center gap-1.5">
            <FaUsers className="w-3 h-3 flex-shrink-0" />
            <span>
              {teacherCount} teacher{teacherCount !== 1 ? "s" : ""}
            </span>
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1.5">
            <FaUsers className="w-3 h-3 flex-shrink-0" />
            <span>
              {studentCount} student{studentCount !== 1 ? "s" : ""}
            </span>
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1.5">
            <FaCalendar className="w-3 h-3 flex-shrink-0" />
            <span>
              {format(new Date(section.updatedAt), "MMM d, yyyy", {
                timeZone: TIMEZONE,
              })}
            </span>
          </Badge>
        </div>
      </div>
    </Card>
  );
}
