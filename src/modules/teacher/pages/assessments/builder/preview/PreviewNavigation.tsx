import { type ReactElement } from "react";
import { usePreview } from "../../../../../core/contexts/preview/preview.context";

export default function PreviewNavigation(): ReactElement {
  const { currentAssessment, currentPage, setCurrentPage } = usePreview();

  if (!currentAssessment) return <></>;

  const totalPages = currentAssessment.pages.length;
  const hasNextPage = currentPage < totalPages - 1;
  const hasPreviousPage = currentPage > 0;

  const handleNext = (): void => {
    if (hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = (): void => {
    if (hasPreviousPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Page {currentPage + 1} of {totalPages}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handlePrevious}
          disabled={!hasPreviousPage}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={!hasNextPage}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 hover:cursor-pointer disabled:cursor-not-allowed transition-colors duration-200"
        >
          Next
        </button>
      </div>
    </div>
  );
}
