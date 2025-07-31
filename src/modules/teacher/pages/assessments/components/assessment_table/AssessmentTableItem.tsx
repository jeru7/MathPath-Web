import { type ReactElement } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { Assessment } from "../../../../../core/types/assessment/assessment.type";
import { getSectionBanner } from "../../../../../core/utils/section/section.util";
import { useParams } from "react-router-dom";
import { useTeacherSections } from "../../../../services/teacher.service";
import AssessmentStatus from "./AssessmentStatus";
import { format } from "date-fns-tz";

type AssessmentTableItemProps = {
  assessment: Assessment;
};

export default function AssessmentTableItem({
  assessment,
}: AssessmentTableItemProps): ReactElement {
  const { teacherId } = useParams();
  const { data: sections } = useTeacherSections(teacherId ?? "");

  const sectionBanners = sections
    ?.filter((section) => assessment.sections.includes(section.id))
    .map((section) => section.banner);

  return (
    <tr className="w-full font-medium hover:bg-gray-100 hover:cursor-pointer">
      {/* Title */}
      <td className="w-[30%]">
        <div
          className={`truncate whitespace-nowrap overflow-hidden max-w-[500px] ${assessment.title ? "" : "text-gray-400"}`}
        >
          {assessment.title ? assessment.title : "(No title)"}
        </div>
      </td>
      {/* Topic */}
      <td className="w-[30%]">
        <div
          className={`truncate whitespace-nowrap overflow-hidden max-w-[400px] ${assessment.topic ? "" : "text-gray-400"}`}
        >
          {assessment.topic ? assessment.topic : "(No topic)"}
        </div>
      </td>
      {/* Section */}
      <td className="w-[15%]">
        <div
          className={`flex gap-2 ${assessment.sections.length === 0 ? "text-gray-400 justify-center" : ""}`}
        >
          {assessment.sections.length === 0
            ? "(No sections)"
            : sectionBanners
              ? sectionBanners?.map((banner) => (
                  <img
                    src={getSectionBanner(banner)}
                    alt="Section banner."
                    className="rounded-sm w-8 h-5"
                  />
                ))
              : "N/A"}
        </div>
      </td>
      {/* Status */}
      <td className="w-[10%]">
        <div className="w-full flex items-center justify-center">
          <AssessmentStatus status={assessment.status} />
        </div>
      </td>
      {/* Deadline */}
      <td
        className={`w-[10%] text-center ${assessment.date.end ? "" : "text-gray-400"}`}
      >
        {assessment.date.end
          ? format(new Date(assessment.date.end), "MMM d 'at' h:mm a", {
              timeZone: "Asia/Manila",
            })
          : "N/A"}
      </td>
      <td className="w-[5%] text-center">
        <button className="hover:scale-110 hover:cursor-pointer">
          <HiDotsVertical />
        </button>
      </td>
    </tr>
  );
}
