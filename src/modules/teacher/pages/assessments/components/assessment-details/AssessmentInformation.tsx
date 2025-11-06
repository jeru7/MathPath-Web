import { format } from "date-fns-tz";
import { type ReactElement } from "react";
import { IoDocumentText } from "react-icons/io5";
import { Assessment } from "../../../../../core/types/assessment/assessment.type";
import {
  FaCalendarAlt,
  FaClock,
  FaListAlt,
  FaChartBar,
  FaUsers,
} from "react-icons/fa";

type AssessmentInformationProps = {
  assessment: Assessment;
  totalQuestions: number;
  averageScore: number;
  studentCount: number;
};

export default function AssessmentInformation({
  assessment,
  totalQuestions,
  averageScore,
  studentCount,
}: AssessmentInformationProps): ReactElement {
  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy", {
        timeZone: "Asia/Manila",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-sm p-3 border border-gray-200 dark:border-gray-700">
      {/* header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-sm">
          <IoDocumentText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Assessment Information
        </h3>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
              Title
            </label>
            <p className="text-xs font-medium text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700/50 p-2 rounded border border-gray-200 dark:border-gray-600 truncate">
              {assessment.title || "Untitled Assessment"}
            </p>
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
              Topic
            </label>
            <p className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded border border-gray-200 dark:border-gray-600 truncate">
              {assessment.topic || "No topic"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
              Questions
            </label>
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded border border-gray-200 dark:border-gray-600">
              <FaListAlt className="w-3 h-3 text-purple-500 flex-shrink-0" />
              <span>{totalQuestions}</span>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
              Avg Score
            </label>
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded border border-gray-200 dark:border-gray-600">
              <FaChartBar className="w-3 h-3 text-green-500 flex-shrink-0" />
              <span>{averageScore}</span>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
              Students
            </label>
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded border border-gray-200 dark:border-gray-600">
              <FaUsers className="w-3 h-3 text-indigo-500 flex-shrink-0" />
              <span>{studentCount}</span>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
              Passing
            </label>
            <div className="text-xs font-medium text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700/50 p-2 rounded border border-gray-200 dark:border-gray-600">
              {assessment.passingScore || 0}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
              Start Date
            </label>
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded border border-gray-200 dark:border-gray-600">
              <FaCalendarAlt className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">
                {assessment.date.start
                  ? formatDate(assessment.date.start)
                  : "Not set"}
              </span>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
              End Date
            </label>
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded border border-gray-200 dark:border-gray-600">
              <FaCalendarAlt className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">
                {assessment.date.end
                  ? formatDate(assessment.date.end)
                  : "Not set"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
              Time Limit
            </label>
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded border border-gray-200 dark:border-gray-600">
              <FaClock className="w-3 h-3 flex-shrink-0" />
              <span>
                {assessment.timeLimit ? `${assessment.timeLimit}m` : "No limit"}
              </span>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
              Attempts
            </label>
            <div className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded border border-gray-200 dark:border-gray-600">
              {assessment.attemptLimit || "Unlimited"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
