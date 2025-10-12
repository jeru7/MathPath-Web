import { type ReactElement } from "react";

type DetailItemProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

export default function DetailItem({
  icon,
  label,
  value,
}: DetailItemProps): ReactElement {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
      <div className="flex items-center space-x-3">
        <div className="text-gray-600 dark:text-gray-400">{icon}</div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
      </div>
      <span className="text-sm font-semibold text-gray-900 dark:text-white">
        {value}
      </span>
    </div>
  );
}
