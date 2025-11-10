import { type ReactElement } from "react";
import { FaCircle, FaRegCircle } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { format } from "date-fns";
import {
  AssessmentStatus,
  AssessmentStatusSection,
} from "../../../../types/assessment-status.type";
import { getSectionBanner } from "../../../../../core/utils/section/section.util";
import { AssessmentStatus as Status } from "../../../../../core/types/assessment/assessment.type";

type AssessmentStatusItemProps = {
  classes?: string;
  assessmentData: AssessmentStatus;
  onItemClick: (assessmentData: AssessmentStatus) => void;
};

export default function AssessmentStatusItem({
  assessmentData,
  onItemClick,
}: AssessmentStatusItemProps): ReactElement {
  const formatDateRange = (date: { start: string; end: string }): string => {
    const startFormatted = format(new Date(date.start), "dd MMM");
    const endFormatted = format(new Date(date.end), "dd MMM");
    return `${startFormatted} - ${endFormatted}`;
  };

  const getStatusConfig = (status: Status) => {
    switch (status) {
      case "finished":
        return {
          icon: FaCircle,
          color: "text-primary",
          bgColor: "bg-primary/10",
          label: "Completed",
        };
      case "published":
        return {
          icon: FaCircle,
          color: "text-chart-2",
          bgColor: "bg-chart-2/10",
          label: "Published",
        };
      case "in-progress":
        return {
          icon: FaRegCircle,
          color: "text-amber-500",
          bgColor: "bg-amber-500/10",
          label: "In Progress",
        };
      case "draft":
        return {
          icon: FaRegCircle,
          color: "text-muted-foreground",
          bgColor: "bg-muted",
          label: "Draft",
        };
      default:
        return {
          icon: FaRegCircle,
          color: "text-muted-foreground",
          bgColor: "bg-muted",
          label: status,
        };
    }
  };

  const statusConfig = getStatusConfig(assessmentData.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/5 cursor-pointer transition-colors group"
      onClick={() => onItemClick(assessmentData)}
    >
      <div className={`p-1.5 rounded-full ${statusConfig.bgColor}`}>
        <StatusIcon className={`w-2.5 h-2.5 ${statusConfig.color}`} />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-foreground truncate">
          {assessmentData.name || "Untitled Assessment"}
        </h3>
        <div className="flex items-center gap-3 mt-1">
          <span className={`text-xs font-medium ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
          <div className="flex items-center gap-1 text-muted-foreground">
            <IoCalendarOutline className="w-3 h-3" />
            <span className="text-xs">
              {formatDateRange(assessmentData?.date)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-1 flex-shrink-0">
        {assessmentData.sections.map(
          (section: AssessmentStatusSection, index) => (
            <img
              src={getSectionBanner(section.banner)}
              alt=""
              key={index}
              className="w-5 h-5 rounded border"
            />
          ),
        )}
      </div>
    </div>
  );
}
