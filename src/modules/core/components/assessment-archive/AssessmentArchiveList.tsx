import { type ReactElement } from "react";
import AssessmentArchiveItem from "./AssessmentArchiveItem";
import { Assessment } from "../../types/assessment/assessment.type";
import { GoArchive } from "react-icons/go";

type AssessmentArchiveListProps = {
  assessments: Assessment[];
  onAssessmentClick: (assessment: Assessment) => void;
};

export default function AssessmentArchiveList({
  assessments,
  onAssessmentClick,
}: AssessmentArchiveListProps): ReactElement {
  if (assessments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <GoArchive className="w-8 h-8 text-muted-foreground/60" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No Archived Assessments
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Assessments that you archive will appear here. You can restore them
            at any time.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-left dark:bg-blue-900/20 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Tip:</strong> Archive assessments to keep your active list
              organized while preserving all data and results.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // sort assessments by archive date (newest first)
  const sortedAssessments = [...assessments].sort((a, b) => {
    const dateA = a.archive?.archiveDate
      ? new Date(a.archive.archiveDate).getTime()
      : new Date(a.updatedAt).getTime();
    const dateB = b.archive?.archiveDate
      ? new Date(b.archive.archiveDate).getTime()
      : new Date(b.updatedAt).getTime();
    return dateB - dateA;
  });

  return (
    <div className="space-y-2">
      {sortedAssessments.map((assessment) => (
        <div
          key={assessment.id}
          onClick={() => onAssessmentClick(assessment)}
          className="cursor-pointer hover:bg-muted/50 transition-colors rounded-lg"
        >
          <AssessmentArchiveItem assessment={assessment} />
        </div>
      ))}
    </div>
  );
}
