import { type ReactElement } from "react";
import { IoDocumentText } from "react-icons/io5";
import { Assessment } from "../../../core/types/assessment/assessment.type";
import { Teacher } from "../../../teacher/types/teacher.type";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import { format } from "date-fns-tz";
import { TIMEZONE } from "../../../core/constants/date.constant";

type AssessmenInformationTypes = {
  assessment: Assessment;
  teacher: Teacher;
};

export default function AssessmentInformation({
  assessment,
  teacher,
}: AssessmenInformationTypes): ReactElement {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-sm p-5 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <IoDocumentText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        Assessment Details
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* left column */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
              Title
            </label>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-sm border border-gray-200 dark:border-gray-600 min-h-[42px] flex items-center">
              {assessment.title || "Untitled Assessment"}
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
              Topic
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-sm border border-gray-200 dark:border-gray-600 min-h-[42px] flex items-center">
              {assessment.topic || "No topic specified"}
            </p>
          </div>

          {teacher && (
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
                Teacher
              </label>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-sm border border-gray-200 dark:border-gray-600 min-h-[42px]">
                <span>
                  {teacher.firstName} {teacher.lastName}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* right column */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
                Start Date
              </label>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-sm border border-gray-200 dark:border-gray-600 min-h-[42px]">
                <FaCalendarAlt className="w-3 h-3 flex-shrink-0" />
                <span>
                  {assessment.date.start
                    ? format(
                      new Date(assessment.date.start),
                      "MMM d 'at' h:mm a",
                      { timeZone: TIMEZONE },
                    )
                    : "Not set"}
                </span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
                End Date
              </label>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-sm border border-gray-200 dark:border-gray-600 min-h-[42px]">
                <FaCalendarAlt className="w-3 h-3 flex-shrink-0" />
                <span>
                  {assessment.date.end
                    ? format(
                      new Date(assessment.date.end),
                      "MMM d 'at' h:mm a",
                      { timeZone: TIMEZONE },
                    )
                    : "Not set"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
                Time Limit
              </label>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-sm border border-gray-200 dark:border-gray-600 min-h-[42px]">
                <FaClock className="w-3 h-3 flex-shrink-0" />
                <span>
                  {assessment.timeLimit
                    ? `${assessment.timeLimit}m`
                    : "No limit"}
                </span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
                Attempt Limit
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-sm border border-gray-200 dark:border-gray-600 min-h-[42px] flex items-center">
                {assessment.attemptLimit || "Unlimited"}
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
              Passing Score
            </label>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-sm border border-gray-200 dark:border-gray-600 min-h-[42px] flex items-center">
              {assessment.passingScore || 0} points
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
