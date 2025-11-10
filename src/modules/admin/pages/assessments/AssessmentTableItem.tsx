import { type ReactElement } from "react";
import { Assessment } from "../../../core/types/assessment/assessment.type";
import { getSectionBanner } from "../../../core/utils/section/section.util";
import AssessmentStatus from "../../../teacher/pages/assessments/components/assessment_table/AssessmentStatus";
import { format } from "date-fns-tz";
import { useAdminContext } from "../../context/admin.context";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type AssessmentTableItemProps = {
  assessment: Assessment;
  teacherName: string;
  onAssessmentClick?: (assessment: Assessment) => void;
  onDeleteAssessment?: (assessment: Assessment) => void;
  onArchiveAssessment?: (assessment: Assessment) => void;
};

export default function AssessmentTableItem({
  assessment,
  teacherName,
  onAssessmentClick,
}: AssessmentTableItemProps): ReactElement {
  const { rawSections } = useAdminContext();

  const sectionBanners = rawSections
    ?.filter((section) => assessment.sections.includes(section.id))
    .map((section) => section.banner);

  const handleRowClick = () => {
    if (onAssessmentClick) {
      onAssessmentClick(assessment);
    }
  };

  return (
    <TableRow
      className="hover:bg-muted/50 cursor-pointer transition-colors group h-18"
      onClick={handleRowClick}
    >
      {/* title */}
      <TableCell className="w-[20%] py-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div
              title={assessment.title ? assessment.title : "(No title)"}
              className={`truncate font-medium ${assessment.title ? "text-foreground" : "text-muted-foreground"
                }`}
            >
              {assessment.title ? assessment.title : "(No title)"}
            </div>
          </div>
        </div>
      </TableCell>

      {/* topic */}
      <TableCell className="w-[15%] py-4">
        <div
          title={assessment.topic ? assessment.topic : "(No topic)"}
          className={`truncate ${assessment.topic ? "text-foreground" : "text-muted-foreground"
            }`}
        >
          {assessment.topic ? assessment.topic : "(No topic)"}
        </div>
      </TableCell>

      {/* teacher */}
      <TableCell className="w-[15%] py-4">
        <div title={teacherName} className="truncate text-foreground">
          {teacherName}
        </div>
      </TableCell>

      {/* sections */}
      <TableCell className="w-[15%] py-4">
        <div className="flex flex-col items-center gap-2">
          <div
            className={`flex gap-1 justify-center ${assessment.sections.length === 0 ? "text-muted-foreground" : ""
              }`}
            title={
              assessment.sections.length > 0 && rawSections
                ? rawSections
                  .filter((section) =>
                    assessment.sections.includes(section.id),
                  )
                  .map((section) => section.name)
                  .join(", ")
                : "No sections"
            }
          >
            {assessment.sections.length === 0 ? (
              <span className="text-sm text-muted-foreground">
                (No sections)
              </span>
            ) : sectionBanners ? (
              <>
                {sectionBanners.slice(0, 3).map((banner, index) => (
                  <img
                    key={index}
                    src={getSectionBanner(banner)}
                    alt="Section banner"
                    className="rounded-sm w-6 h-4 border border-border"
                  />
                ))}
                {sectionBanners.length > 3 && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                    +{sectionBanners.length - 3}
                  </Badge>
                )}
              </>
            ) : (
              <span className="text-sm text-muted-foreground">N/A</span>
            )}
          </div>
        </div>
      </TableCell>

      {/* status */}
      <TableCell className="w-[15%] py-4">
        <div className="w-full flex items-center justify-center">
          <AssessmentStatus status={assessment.status} />
        </div>
      </TableCell>

      {/* deadline */}
      <TableCell className="w-[15%] py-4">
        <div className="text-center">
          <div
            className={`text-sm ${assessment.date.end ? "text-foreground" : "text-muted-foreground"
              }`}
          >
            {assessment.date.end
              ? format(new Date(assessment.date.end), "MMM d 'at' h:mm a", {
                timeZone: "Asia/Manila",
              })
              : "N/A"}
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}
