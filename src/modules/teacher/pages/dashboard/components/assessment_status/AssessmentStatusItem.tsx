import { type ReactElement } from "react";
import { FaRegCircle } from "react-icons/fa6";
import { FaCircle } from "react-icons/fa";
import { IoCalendarClear } from "react-icons/io5";
import { format } from "date-fns";
import Banner1 from "../../../../../../assets/images/section-banners/Banner_1.jpg";
import Banner2 from "../../../../../../assets/images/section-banners/Banner_2.jpg";
import Banner3 from "../../../../../../assets/images/section-banners/Banner_3.jpg";
import { SectionBanner } from "../../../../../core/types/section/section.type";
import {
  AssessmentStatus,
  AssessmentStatusSection,
} from "../../../../types/assessment-status.type";

interface IAssessmentStatusItemProps {
  classes: string;
  assessmentData: AssessmentStatus;
}

export default function AssessmentStatusItem({
  classes,
  assessmentData,
}: IAssessmentStatusItemProps): ReactElement {
  const completed = assessmentData?.status === "Completed";

  const formatDateRange = (date: { start: string; end: string }): string => {
    const startFormatted = format(new Date(date.start), "dd MMM").toUpperCase();
    const endFormatted = format(new Date(date.end), "dd MMM").toUpperCase();

    return `${startFormatted} - ${endFormatted}`;
  };

  const getSectionBanner = (banner: SectionBanner): string => {
    if (banner === "SBanner_1") {
      return Banner1;
    } else if (banner === "SBanner_2") {
      return Banner2;
    } else if (banner === "SBanner_3") {
      return Banner3;
    }

    return Banner1;
  };

  return (
    <article
      className={`${classes} flex justify-between border-l-4 pl-2 rounded-md border-1 border-gray-200 p-2`}
      style={{
        borderLeftColor: `${completed ? "var(--primary-green)" : "var(--primary-yellow)"}`,
      }}
    >
      {/* Title and Status */}
      <div className="flex flex-col gap-1">
        <p className="text-md font-semibold">{assessmentData?.name}</p>
        <div className="flex items-center gap-1">
          {completed ? (
            <FaCircle className="text-[var(--primary-green)]" />
          ) : (
            <FaRegCircle className="text-[var(--primary-yellow)]" />
          )}
          <p
            className="text-xs"
            style={{
              color: `${completed ? "var(--primary-green)" : "var(--primary-yellow)"}`,
            }}
          >
            {assessmentData?.status}
          </p>
        </div>
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
