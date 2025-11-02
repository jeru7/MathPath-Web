import { type ReactElement } from "react";
import { motion } from "framer-motion";
import { MdCalendarToday } from "react-icons/md";
import { format } from "date-fns-tz";
import { Assessment } from "../../types/assessment/assessment.type";
import { TIMEZONE } from "../../constants/date.constant";

type AssessmentArchiveItemProps = {
  assessment: Assessment;
};

export default function AssessmentArchiveItem({
  assessment,
}: AssessmentArchiveItemProps): ReactElement {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "published":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "finished":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // calculate total questions
  const totalQuestions =
    assessment.pages?.reduce((total, page) => {
      const questionCount = page.contents.filter(
        (content) => content.type === "question",
      ).length;
      return total + questionCount;
    }, 0) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
    >
      <div className="flex items-start gap-3">
        {/* assessment details */}
        <div className="flex-1 min-w-0">
          {/* title and status */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                {assessment.title || "Untitled Assessment"}
              </h4>
              {assessment.description && (
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-1">
                  {assessment.description}
                </p>
              )}
            </div>
            <span
              className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                assessment.status,
              )}`}
            >
              {assessment.status.replace("-", " ")}
            </span>
          </div>

          {/* topic and metadata */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2 flex-wrap">
            {assessment.topic && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Topic: {assessment.topic}
              </p>
            )}
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 w-fit">
              {assessment.sections?.length || 0} section
              {(assessment.sections?.length || 0) !== 1 ? "s" : ""}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-800 w-fit">
              {totalQuestions} question{totalQuestions !== 1 ? "s" : ""}
            </span>
            {assessment.timeLimit > 0 && (
              <span className="text-xs px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 border border-orange-200 dark:border-orange-800 w-fit">
                {assessment.timeLimit}m limit
              </span>
            )}
          </div>

          {/* date information */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            {/* archive date */}
            {assessment.archive.archiveDate && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <MdCalendarToday className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <p className="text-xs sm:text-sm">
                  Archived on{" "}
                  {format(
                    new Date(assessment.archive.archiveDate),
                    "MMM d, yyyy 'at' h:mm a",
                    { timeZone: TIMEZONE },
                  )}
                </p>
              </div>
            )}

            {/* date range */}
            {(assessment.date.start || assessment.date.end) && (
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <MdCalendarToday className="w-3 h-3 flex-shrink-0" />
                <p className="text-xs">
                  {assessment.date.start && assessment.date.end
                    ? `${format(new Date(assessment.date.start), "MMM d", { timeZone: TIMEZONE })} - ${format(new Date(assessment.date.end), "MMM d, yyyy", { timeZone: TIMEZONE })}`
                    : assessment.date.start
                      ? `Starts ${format(new Date(assessment.date.start), "MMM d, yyyy", { timeZone: TIMEZONE })}`
                      : `Ends ${format(new Date(assessment.date.end!), "MMM d, yyyy", { timeZone: TIMEZONE })}`}
                </p>
              </div>
            )}
          </div>

          {/* created date */}
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-1">
            <p className="text-xs">
              Created:{" "}
              {format(new Date(assessment.createdAt), "MMM d, yyyy", {
                timeZone: TIMEZONE,
              })}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
