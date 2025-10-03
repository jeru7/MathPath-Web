import { type ReactElement } from "react";
import { IoGameController } from "react-icons/io5";

export default function BadgeItem(): ReactElement {
  return (
    <div className="flex flex-col items-center p-4 rounded-lg border border-gray-300 bg-white w-40 h-full justify-between max-h-48 max-w-48">
      {/* icon */}
      <div className="rounded-full flex items-center justify-center p-3 bg-gradient-to-br from-blue-500 to-blue-600 mb-3">
        <IoGameController className="h-7 w-7 text-white" />
      </div>

      {/* info */}
      <div className="text-center mb-3">
        <p className="font-semibold text-gray-900 text-sm mb-1">Badge name</p>
        <p className="text-gray-600 text-xs">Complete something</p>
      </div>

      {/* progress bar */}
      <div className="w-full">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>75%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
            style={{ width: "75%" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
