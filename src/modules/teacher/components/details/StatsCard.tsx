import { type ReactElement } from "react";

type StatsCardProps = {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  isLoading?: boolean;
};

export default function StatsCard({
  icon,
  title,
  value,
  iconBgColor,
  iconColor,
  isLoading,
}: StatsCardProps): ReactElement {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-sm p-3 md:p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 md:gap-3">
        <div className={`p-1.5 md:p-2 ${iconBgColor} rounded-sm flex-shrink-0`}>
          <div className={`w-3 h-3 md:w-4 md:h-4 ${iconColor}`}>{icon}</div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide truncate">
            {title}
          </p>
          <p className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
            {isLoading ? (
              <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-5 md:h-6 w-12 md:w-16 rounded"></div>
            ) : (
              value
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
