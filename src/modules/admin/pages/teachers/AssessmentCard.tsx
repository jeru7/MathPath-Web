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
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6">
        <div className="flex-1 min-w-0">
          {/* header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base leading-7 line-clamp-2 mb-1">
                {assessment.title || "Untitled Assessment"}
              </h3>
              {assessment.topic && (
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                  {assessment.topic}
                </p>
              )}
            </div>
            <div className="flex flex-row sm:flex-col items-start sm:items-end justify-between sm:justify-start gap-2 flex-shrink-0">
              <AssessmentStatus status={assessment.status} />
              <Badge variant="secondary" className="flex items-center gap-1">
                <FaCalendar className="w-3 h-3 opacity-70" />
                <span className="text-xs">
                  {format(new Date(assessment.createdAt), "MMM d, yyyy", {
                    timeZone: TIMEZONE,
                  })}
                </span>
              </Badge>
            </div>
          </div>

          {/* description */}
          {assessment.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-6 line-clamp-2 mb-4">
              {assessment.description}
            </p>
          )}

          {/* stats grid */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaFileAlt className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                  Questions
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {getTotalQuestions(assessment)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaClock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                  Duration
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {formatTimeLimit(assessment.timeLimit)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaUsers className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                  Sections
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {assessment.sections.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaCheck className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                  Passing Score
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {assessment.passingScore}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* date footer */}
      {assessment.date.start && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {format(new Date(assessment.date.start), "MMM d, yyyy")}
              {assessment.date.end &&
                ` - ${format(new Date(assessment.date.end), "MMM d, yyyy")}`}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
