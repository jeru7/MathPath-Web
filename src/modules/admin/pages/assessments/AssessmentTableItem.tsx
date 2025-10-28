import { type ReactElement } from "react";
import { format } from "date-fns-tz";
import { Assessment } from "../../../core/types/assessment/assessment.type";
import { useAdminContext } from "../../context/admin.context";
import AssessmentStatus from "../../../teacher/pages/assessments/components/assessment_table/AssessmentStatus";
import { getSectionBanner } from "../../../core/utils/section/section.util";

type AssessmentTableItemProps = {
  assessment: Assessment;
  teacherName: string;
  onAssessmentClick?: (assessment: Assessment) => void;
  onDeleteAssessment?: (assessment: Assessment) => void;
};

export default function AssessmentTableItem({
  assessment,
  teacherName,
  onAssessmentClick,
}: AssessmentTableItemProps): ReactElement {
  const { sections } = useAdminContext();

  const sectionBanners = sections
    ?.filter((section) => assessment.sections.includes(section.id))
    .map((section) => section.banner);

  const handleRowClick = () => {
    if (onAssessmentClick) {
      onAssessmentClick(assessment);
    }
  };

  return (
    <tr
      className="w-full font-medium text-sm xl:text-base hover:bg-gray-100 dark:hover:bg-gray-700 hover:cursor-pointer overflow-visible transition-colors duration-200"
      onClick={handleRowClick}
    >
      {/* title */}
      <td className="w-[15%] xl:w-[20%]">
        <div
          title={assessment.title ? assessment.title : "(No title)"}
          className={`truncate whitespace-nowrap overflow-hidden max-w-[500px] ${assessment.title
              ? "text-gray-900 dark:text-gray-100"
              : "text-gray-400 dark:text-gray-500"
            }`}
        >
          {assessment.title ? assessment.title : "(No title)"}
        </div>
      </td>
      {/* topic */}
      <td className="w-[15%] xl:w-[15%]">
        <div
          title={assessment.topic ? assessment.topic : "(No title)"}
          className={`truncate whitespace-nowrap overflow-hidden max-w-[400px] ${assessment.topic
              ? "text-gray-900 dark:text-gray-100"
              : "text-gray-400 dark:text-gray-500"
            }`}
        >
          {assessment.topic ? assessment.topic : "(No topic)"}
        </div>
      </td>
      {/* teacher */}
      <td className="w-[15%]">
        <div
          title={teacherName}
          className="truncate whitespace-nowrap overflow-hidden max-w-[400px] text-gray-900 dark:text-gray-100"
        >
          {teacherName}
        </div>
      </td>
      {/* section */}
      <td className="w-[10%]">
        <div
          className={`flex gap-2 justify-center ${assessment.sections.length === 0
              ? "text-gray-400 dark:text-gray-500"
              : ""
            }`}
        >
          {assessment.sections.length === 0
            ? "(No sections)"
            : sectionBanners
              ? sectionBanners?.map((banner, index) => (
                <img
                  key={index}
                  src={getSectionBanner(banner)}
                  alt="Section banner."
                  className="rounded-sm w-8 h-5"
                />
              ))
              : "N/A"}
        </div>
      </td>
      {/* status */}
      <td className="w-[10%]">
        <div className="w-full flex items-center justify-center">
          <AssessmentStatus status={assessment.status} />
        </div>
      </td>
      {/* deadline */}
      <td
        className={`w-[10%] text-center ${assessment.date.end
            ? "text-gray-900 dark:text-gray-100"
            : "text-gray-400 dark:text-gray-500"
          }`}
      >
        {assessment.date.end
          ? format(new Date(assessment.date.end), "MMM d 'at' h:mm a", {
            timeZone: "Asia/Manila",
          })
          : "N/A"}
      </td>
    </tr>
  );
}
