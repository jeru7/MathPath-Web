import { type ReactElement } from "react";
import { Assessment } from "../../../../../core/types/assessment/assessment.type";
import { getSectionBanner } from "../../../../../core/utils/section/section.util";
import AssessmentStatus from "./AssessmentStatus";
import { format } from "date-fns-tz";
import { useTeacherContext } from "../../../../context/teacher.context";

type AssessmentTableItemProps = {
  assessment: Assessment;
  onAssessmentClick?: (assessment: Assessment) => void;
  onArchiveAssessment?: (assessment: Assessment) => void;
};

export default function AssessmentTableItem({
  assessment,
  onAssessmentClick,
}: AssessmentTableItemProps): ReactElement {
  const { sections } = useTeacherContext();

  const sectionBanners = sections
    ?.filter((section) => assessment.sections.includes(section.id))
    .map((section) => section.banner);

  const handleRowClick = () => {
    // only call the click handler to open the details modal
    if (onAssessmentClick) {
      onAssessmentClick(assessment);
    }
  };

  return (
    <>
      <tr
        className="w-full font-medium text-sm xl:text-base hover:bg-gray-50 dark:hover:bg-gray-700 hover:cursor-pointer overflow-visible transition-colors duration-200 group"
        onClick={handleRowClick}
      >
        {/* title with archive button */}
        <td className="w-[15%] xl:w-[20%] py-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div
                title={assessment.title ? assessment.title : "(No title)"}
                className={`truncate whitespace-nowrap overflow-hidden max-w-[500px] font-medium ${assessment.title
                    ? "text-gray-900 dark:text-gray-100"
                    : "text-gray-400 dark:text-gray-500"
                  }`}
              >
                {assessment.title ? assessment.title : "(No title)"}
              </div>
            </div>
          </div>
        </td>

        {/* topic */}
        <td className="w-[15%] xl:w-[20%] py-3">
          <div
            title={assessment.topic ? assessment.topic : "(No topic)"}
            className={`truncate whitespace-nowrap overflow-hidden max-w-[400px] ${assessment.topic
                ? "text-gray-900 dark:text-gray-100"
                : "text-gray-400 dark:text-gray-500"
              }`}
          >
            {assessment.topic ? assessment.topic : "(No topic)"}
          </div>
        </td>

        {/* section */}
        <td className="w-[15%] py-3">
          <div className="flex flex-col items-center gap-2">
            <div
              className={`flex gap-1 justify-center ${assessment.sections.length === 0
                  ? "text-gray-400 dark:text-gray-500"
                  : ""
                }`}
            >
              {assessment.sections.length === 0
                ? "(No sections)"
                : sectionBanners
                  ? sectionBanners
                    ?.slice(0, 3)
                    .map((banner, index) => (
                      <img
                        key={index}
                        src={getSectionBanner(banner)}
                        alt="Section banner."
                        className="rounded-sm w-6 h-4 border border-gray-200 dark:border-gray-600"
                      />
                    ))
                  : "N/A"}
              {sectionBanners && sectionBanners.length > 3 && (
                <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                  +{sectionBanners.length - 3}
                </div>
              )}
            </div>
          </div>
        </td>

        {/* status */}
        <td className="w-[10%] py-3">
          <div className="w-full flex items-center justify-center">
            <AssessmentStatus status={assessment.status} />
          </div>
        </td>

        {/* deadline */}
        <td className="w-[10%] py-3">
          <div className="text-center">
            <div
              className={`${assessment.date.end
                  ? "text-gray-900 dark:text-gray-100"
                  : "text-gray-400 dark:text-gray-500"
                }`}
            >
              {assessment.date.end
                ? format(new Date(assessment.date.end), "MMM d 'at' h:mm a", {
                  timeZone: "Asia/Manila",
                })
                : "N/A"}
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}
