import { type ReactElement } from "react";
import { getBadgeIcon } from "../../../../core/utils/badge/badge.util";
import { Badge } from "../../../../core/types/badge/badge.type";

type BadgeItemProps = {
  badge: Badge;
  studentProgress: {
    completed: boolean;
    progress: number;
    reqCompleted: number;
    dateFinished: Date | null;
  };
};

export default function BadgeItem({
  badge,
  studentProgress,
}: BadgeItemProps): ReactElement {
  const { completed, progress, reqCompleted } = studentProgress;
  const badgeIcon = getBadgeIcon(badge.type);

  const getStatusConfig = () => {
    if (completed) {
      return {
        border: "border-emerald-500 dark:border-emerald-400",
        background: "bg-emerald-50 dark:bg-emerald-900/20",
        progressBar: "bg-emerald-500",
        statusColor: "text-emerald-600 dark:text-emerald-400",
        statusText: "Completed",
      };
    } else {
      return {
        border: "border-gray-300 dark:border-gray-600",
        background: "bg-gray-50 dark:bg-gray-800",
        progressBar: "bg-blue-500",
        statusColor: "text-gray-600 dark:text-gray-400",
        statusText: "In Progress",
      };
    }
  };

  const status = getStatusConfig();

  return (
    <div
      className={`flex flex-col items-center p-3 sm:p-4 rounded-xl border-2 w-32 h-40 sm:w-40 sm:h-48 transition-all duration-200 ${status.border} ${status.background} shadow-sm hover:shadow-md flex-shrink-0`}
    >
      {/* Badge Icon */}
      <div className="flex items-center justify-center mb-2 sm:mb-3 flex-shrink-0">
        <img
          src={badgeIcon}
          alt={badge.name}
          className="h-10 w-10 sm:h-12 sm:w-12"
        />
      </div>

      {/* Badge Info */}
      <div className="text-center mb-2 sm:mb-3 w-full flex-1 min-h-0">
        <p className="font-semibold text-gray-900 dark:text-gray-100 text-xs sm:text-sm leading-tight mb-1 sm:mb-2 line-clamp-2">
          {badge.name}
        </p>
        <div className="flex justify-between items-center text-xs mb-1 sm:mb-2">
          <span className="text-gray-500 dark:text-gray-400 text-xs">
            Progress
          </span>
          <span className="font-medium text-gray-700 dark:text-gray-300 text-xs">
            {reqCompleted}/{badge.req}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full mb-1 sm:mb-2 flex-shrink-0">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 sm:h-2">
          <div
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${status.progressBar}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Status */}
      <div
        className={`text-xs font-semibold ${status.statusColor} flex-shrink-0`}
      >
        {status.statusText}
      </div>
    </div>
  );
}
