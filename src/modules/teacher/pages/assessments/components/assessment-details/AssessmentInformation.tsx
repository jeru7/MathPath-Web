import { format } from "date-fns-tz";
import { type ReactElement } from "react";
import { IoDocumentText } from "react-icons/io5";
import { Assessment } from "../../../../../core/types/assessment/assessment.type";
import { FaCalendarAlt, FaClock } from "react-icons/fa";

type AssessmentInformationProps = {
  assessment: Assessment;
};

export default function AssessmentInformation({
  assessment,
}: AssessmentInformationProps): ReactElement {
  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy 'at' hh:mm a", {
        timeZone: "Asia/Manila",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-sm p-5 border border-gray-200 dark:border-gray-700 h-fit">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <IoDocumentText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        Assessment Information
      </h3>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
            Title
          </label>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-sm border border-gray-200 dark:border-gray-600">
            {assessment.title || "Untitled Assessment"}
          </p>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
            Topic
          </label>
          <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-sm border border-gray-200 dark:border-gray-600">
            {assessment.topic || "No topic specified"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
              Start Date
            </label>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-sm border border-gray-200 dark:border-gray-600">
              <FaCalendarAlt className="w-3 h-3 flex-shrink-0" />
              <span
                className="truncate"
                title={formatDate(assessment.date.start!)}
              >
                {assessment.date.start
                  ? formatDate(assessment.date.start)
                  : "Not set"}
              </span>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
              End Date
            </label>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-sm border border-gray-200 dark:border-gray-600">
              <FaCalendarAlt className="w-3 h-3 flex-shrink-0" />
              <span
                className="truncate"
                title={formatDate(assessment.date.end!)}
              >
                {assessment.date.end
                  ? formatDate(assessment.date.end)
                  : "Not set"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
              Time Limit
            </label>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-sm border border-gray-200 dark:border-gray-600">
              <FaClock className="w-3 h-3 flex-shrink-0" />
              <span>
                {assessment.timeLimit ? `${assessment.timeLimit}m` : "No limit"}
              </span>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
              Attempt Limit
            </label>
            <p className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-sm border border-gray-200 dark:border-gray-600">
              {assessment.attemptLimit || "Unlimited"}
            </p>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
            Passing Score
          </label>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-sm border border-gray-200 dark:border-gray-600">
            {assessment.passingScore || 0} points
          </p>
        </div>
      </div>
    </div>
  );
}
