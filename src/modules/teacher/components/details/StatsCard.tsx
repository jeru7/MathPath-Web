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
    <div className="bg-white dark:bg-gray-800 rounded-sm p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div className={`p-2 ${iconBgColor} rounded-sm`}>
          <div className={`w-4 h-4 ${iconColor}`}>{icon}</div>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {isLoading ? (
              <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-6 w-8 rounded"></div>
            ) : (
              value
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
