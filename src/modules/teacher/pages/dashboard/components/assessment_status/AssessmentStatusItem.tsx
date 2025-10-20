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

type AssessmentStatusItemProps = {
  classes: string;
  assessmentData: AssessmentStatus;
  onItemClick: (assessmentData: AssessmentStatus) => void;
};

export default function AssessmentStatusItem({
  classes,
  assessmentData,
  onItemClick,
}: AssessmentStatusItemProps): ReactElement {
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
            <FaCircle className="text-green-600 dark:text-green-400" />
            <p className="text-xs text-green-600 dark:text-green-400">
              {assessmentData?.status}
            </p>
          </div>
        );
      case "in-progress":
      case "published":
        return (
          <div className="flex items-center gap-1">
            <FaRegCircle className="text-green-500 dark:text-green-300" />
            <p className="text-xs text-green-500 dark:text-green-300">
              {assessmentData?.status}
            </p>
          </div>
        );
      case "draft":
        return (
          <div className="flex items-center gap-1">
            <FaRegCircle className="text-yellow-500 dark:text-yellow-400" />
            <p className="text-xs text-yellow-500 dark:text-yellow-400">
              {assessmentData?.status}
            </p>
          </div>
        );
    }
  };

  const handleItemClick = () => {
    onItemClick(assessmentData);
  };

  return (
    <article
      className={`${classes} flex justify-between border-l-4 pl-2 rounded-md border border-gray-200 dark:border-gray-600 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 hover:cursor-pointer transition-colors duration-200`}
      style={{
        borderLeftColor: `${completed ? "#16a34a" : "#eab308"}`,
      }}
      onClick={handleItemClick}
    >
      {/* title and status */}
      <div className="flex flex-col gap-1">
        <p className="text-md font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">
          {assessmentData.name ? assessmentData.name : "N/A"}
        </p>
        {getStatus(assessmentData.status)}
      </div>

      <div className="flex flex-col justify-between items-end">
        {/* date: start - end */}
        <div className="flex gap-1 text-gray-400 dark:text-gray-500">
          <p className="text-[10px] font-semibold">
            {formatDateRange(assessmentData?.date)}
          </p>
          <IoCalendarClear className="" />
        </div>

        {/* sections */}
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
