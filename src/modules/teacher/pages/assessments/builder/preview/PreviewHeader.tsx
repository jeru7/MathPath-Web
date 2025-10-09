import { type ReactElement } from "react";
import { IoClose } from "react-icons/io5";
import { Assessment } from "../../../../../core/types/assessment/assessment.type";

type PreviewHeaderProps = {
  assessment: Assessment;
  onClose: () => void;
};

export default function PreviewHeader({
  assessment,
  onClose,
}: PreviewHeaderProps): ReactElement {
  return (
    <div className="flex bg-white items-center justify-between p-4 border-b border-gray-300 dark:bg-gray-900 dark:border-gray-700">
      <div className="flex-1">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {assessment.title || "Untitled Assessment"}
        </h2>
        {assessment.topic && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Topic: {assessment.topic}
          </p>
        )}
        {assessment.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {assessment.description}
          </p>
        )}
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-500">
          <span>Preview Mode</span>
          <span>•</span>
          <span>
            {assessment.pages.length} page
            {assessment.pages.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-2 hover:cursor-pointer rounded-sm self-start"
      >
        <IoClose className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </button>
    </div>
  );
}
