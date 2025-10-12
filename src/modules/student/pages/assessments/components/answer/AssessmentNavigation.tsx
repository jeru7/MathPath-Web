import { type ReactElement } from "react";
import { usePreview } from "../../../../../core/contexts/preview/preview.context";
import { IoChevronBack, IoChevronForward, IoCheckmark } from "react-icons/io5";

type AssessmentNavigationProps = {
  onSubmit?: () => void;
  isSubmitting?: boolean;
};

export default function AssessmentNavigation({
  onSubmit,
  isSubmitting = false,
}: AssessmentNavigationProps): ReactElement {
  const { currentAssessment, currentPage, setCurrentPage } = usePreview();

  if (!currentAssessment) return <></>;

  const totalPages = currentAssessment.pages.length;
  const hasNextPage = currentPage < totalPages - 1;
  const hasPreviousPage = currentPage > 0;
  const isLastPage = currentPage === totalPages - 1;

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
    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="max-w-4xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Progress:{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {currentPage + 1}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {totalPages}
              </span>{" "}
              pages
            </div>

            {/* progress dots */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    index === currentPage
                      ? "bg-green-600"
                      : index < currentPage
                        ? "bg-green-400"
                        : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrevious}
              disabled={!hasPreviousPage}
              className="flex items-center space-x-2 px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              <IoChevronBack className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {isLastPage ? (
              <button
                onClick={onSubmit}
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <IoCheckmark className="w-4 h-4" />
                    <span>Submit Assessment</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
              >
                <span>Next</span>
                <IoChevronForward className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
