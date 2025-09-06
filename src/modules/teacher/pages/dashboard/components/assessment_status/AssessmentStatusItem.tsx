import { type ReactElement } from "react";
import { FaRegCircle } from "react-icons/fa6";
import { FaCircle } from "react-icons/fa";
import { IoCalendarClear } from "react-icons/io5";
import { format } from "date-fns";
import {
  AssessmentStatus,
  AssessmentStatusSection,
} from "../../../../types/assessment-status.type";
import { getSectionBanner } from "../../../../../core/utils/section/section.util";
import { AssessmentStatus as Status } from "../../../../../core/types/assessment/assessment.type";
import { useNavigate } from "react-router-dom";

interface IAssessmentStatusItemProps {
  classes: string;
  assessmentData: AssessmentStatus;
}

export default function AssessmentStatusItem({
  classes,
  assessmentData,
}: IAssessmentStatusItemProps): ReactElement {
  const navigate = useNavigate();

  const completed =
    assessmentData?.status === "finished" ||
    assessmentData?.status === "published";

  const formatDateRange = (date: { start: string; end: string }): string => {
    const startFormatted = format(new Date(date.start), "dd MMM").toUpperCase();
    const endFormatted = format(new Date(date.end), "dd MMM").toUpperCase();

    return `${startFormatted} - ${endFormatted}`;
  };

  const getStatus = (status: Status) => {
    switch (status) {
      case "finished":
        return (
          <div className="flex items-center gap-1">
            <FaCircle className="text-[var(--primary-green)]" />
            <p className="text-xs text-[var(--primary-green)]">
              {assessmentData?.status}
            </p>
          </div>
        );
      case "in-progress":
      case "published":
        return (
          <div className="flex items-center gap-1">
            <FaRegCircle className="text-[var(--secondary-green)]" />
            <p className="text-xs text-[var(--secondary-green)]">
              {assessmentData?.status}
            </p>
          </div>
        );
      case "draft":
        return (
          <div className="flex items-center gap-1">
            <FaRegCircle className="text-[var(--primary-yellow)]" />
            <p className="text-xs text-[var(--primary-yellow)]">
              {assessmentData?.status}
            </p>
          </div>
        );
    }
  };

  const handleItemClick = () => {
    navigate(`assessments/${assessmentData.id}`);
  };

  return (
    <article
      className={`${classes} flex justify-between border-l-4 pl-2 rounded-md border-1 border-gray-200 p-2 hover:bg-gray-100 hover:cursor-pointer`}
      style={{
        borderLeftColor: `${completed ? "var(--primary-green)" : "var(--primary-yellow)"}`,
      }}
      onClick={handleItemClick}
    >
      {/* Title and Status */}
      <div className="flex flex-col gap-1">
        <p className="text-md font-semibold">
          {assessmentData.name ? assessmentData.name : "N/A"}
        </p>
        {getStatus(assessmentData.status)}
      </div>
      {/* Date and Sections */}
      <div className="flex flex-col justify-between items-end">
        {/* Date: Start - End */}
        <div className="flex gap-1 text-gray-400">
          <p className="text-[10px] font-semibold">
            {formatDateRange(assessmentData?.date)}
          </p>
          <IoCalendarClear className="" />
        </div>
        {/* Sections */}
        <div className="flex gap-1">
          {assessmentData?.sections.map(
            (section: AssessmentStatusSection, index) => (
              <img
                src={getSectionBanner(section.banner)}
                alt="Section Banner"
                key={index}
                className="w-6 h-4 rounded-md"
              />
            ),
          )}
        </div>
      </div>
    </article>
  );
}
