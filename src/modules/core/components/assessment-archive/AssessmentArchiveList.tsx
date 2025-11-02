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
      <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <GoArchive className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No Archived Assessments
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Assessments that you archive will appear here. You can restore them
            at any time.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-sm p-3 text-left">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Tip:</strong> Archive assessments to keep your active list
              organized while preserving all data and results.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // sort assessments by archive date
  const sortedAssessments = [...assessments].sort((a, b) => {
    const dateA = a.archive?.archiveDate
      ? new Date(a.archive.archiveDate).getTime()
      : new Date(a.updatedAt).getTime();
    const dateB = b.archive?.archiveDate
      ? new Date(b.archive.archiveDate).getTime()
      : new Date(b.updatedAt).getTime();
    return dateB - dateA;
  });

  // group assessments by status for better organization: walang draft since bawal i-archive
  const groupedAssessments = {
    published: sortedAssessments.filter((a) => a.status === "published"),
    finished: sortedAssessments.filter((a) => a.status === "finished"),
    inProgress: sortedAssessments.filter((a) => a.status === "in-progress"),
  };

  return (
    <div className="space-y-6">
      {/* published assessments */}
      {groupedAssessments.published.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Published Assessments
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
              {groupedAssessments.published.length}
            </span>
          </h3>
          <div className="space-y-2">
            {groupedAssessments.published.map((assessment) => (
              <div
                key={assessment.id}
                onClick={() => onAssessmentClick(assessment)}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg"
              >
                <AssessmentArchiveItem assessment={assessment} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* finished assessments */}
      {groupedAssessments.finished.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            Finished Assessments
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
              {groupedAssessments.finished.length}
            </span>
          </h3>
          <div className="space-y-2">
            {groupedAssessments.finished.map((assessment) => (
              <div
                key={assessment.id}
                onClick={() => onAssessmentClick(assessment)}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg"
              >
                <AssessmentArchiveItem assessment={assessment} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* in progress assessments */}
      {groupedAssessments.inProgress.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            In Progress Assessments
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
              {groupedAssessments.inProgress.length}
            </span>
          </h3>
          <div className="space-y-2">
            {groupedAssessments.inProgress.map((assessment) => (
              <div
                key={assessment.id}
                onClick={() => onAssessmentClick(assessment)}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg"
              >
                <AssessmentArchiveItem assessment={assessment} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
