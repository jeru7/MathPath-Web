import { type ReactElement } from "react";
import { IoGameController } from "react-icons/io5";

export default function BadgeItem(): ReactElement {
  return (
    <div className="flex flex-col items-center p-4 rounded-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 justify-between h-full w-full min-w-48 min-h-48 max-h-56 max-w-56 transition-colors duration-200">
      {/* icon */}
      <div className="rounded-full flex items-center justify-center p-3 bg-gradient-to-br from-blue-500 to-blue-600 mb-3">
        <IoGameController className="h-10 w-10 text-white" />
      </div>

      {/* info */}
      <div className="text-center mb-3">
        <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1 transition-colors duration-200">
          Badge name
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-xs transition-colors duration-200">
          Complete something
        </p>
      </div>

      {/* progress bar */}
      <div className="w-full">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-200">
          <span>Progress</span>
          <span>75%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 transition-colors duration-200">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
            style={{ width: "75%" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
