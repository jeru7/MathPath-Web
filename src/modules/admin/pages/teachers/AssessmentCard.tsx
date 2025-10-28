import { type ReactElement } from "react";
import { format } from "date-fns-tz";
import {
  FaFileAlt,
  FaClock,
  FaUsers,
  FaCheck,
  FaCalendar,
} from "react-icons/fa";
import { Assessment } from "../../../core/types/assessment/assessment.type";
import { TIMEZONE } from "../../../core/constants/date.constant";
import AssessmentStatus from "../../../teacher/pages/assessments/components/assessment_table/AssessmentStatus";

type AssessmentCardProps = {
  assessment: Assessment;
};

export default function AssessmentCard({
  assessment,
}: AssessmentCardProps): ReactElement {
  const formatTimeLimit = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours} hour${hours > 1 ? "s" : ""}`;
  };

  const getTotalQuestions = (assessment: Assessment) => {
    return assessment.pages.reduce((count, page) => {
      return (
        count +
        page.contents.filter((content) => content.type === "question").length
      );
    }, 0);
  };
  return (
    <div className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
      {/* header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 pr-4">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-base mb-1.5 line-clamp-2">
            {assessment.title || "Untitled Assessment"}
          </h4>
          {assessment.topic && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
              {assessment.topic}
            </p>
          )}
        </div>
        <AssessmentStatus status={assessment.status} />
      </div>

      {/* description */}
      {assessment.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
          {assessment.description}
        </p>
      )}

      {/* stats grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
            <FaFileAlt className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Questions
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {getTotalQuestions(assessment)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
            <FaClock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {formatTimeLimit(assessment.timeLimit)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
            <FaUsers className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Sections</p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {assessment.sections.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
            <FaCheck className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Passing Score
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {assessment.passingScore} points
            </p>
          </div>
        </div>
      </div>

      {/* footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <FaCalendar className="w-3 h-3 opacity-70" />
          <span>
            Created{" "}
            {format(new Date(assessment.createdAt), "MMM d, yyyy", {
              timeZone: TIMEZONE,
            })}
          </span>
        </div>

        {assessment.date.start && (
          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {format(new Date(assessment.date.start), "MMM d")}
            {assessment.date.end &&
              ` - ${format(new Date(assessment.date.end), "MMM d")}`}
          </div>
        )}
      </div>
    </div>
  );
}
