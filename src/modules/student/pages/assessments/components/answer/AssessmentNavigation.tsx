import { type ReactElement } from "react";
import { usePreview } from "../../../../../core/contexts/preview/preview.context";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

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
    if (hasNextPage) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = (): void => {
    if (hasPreviousPage) setCurrentPage(currentPage - 1);
  };

  const baseButtonClasses =
    "flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 rounded-lg font-semibold shadow-sm transition-all duration-200 min-w-[120px] sm:min-w-[140px] h-[44px]";

  return (
    <div className="relative z-10 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-row items-center justify-center w-full sm:w-auto gap-2">
            <div className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
              Page{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {currentPage + 1}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {totalPages}
              </span>
            </div>
            <div className="flex items-center justify-center gap-1 ml-3">
              {Array.from({ length: totalPages }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${index === currentPage
                      ? "bg-green-600"
                      : index < currentPage
                        ? "bg-green-400"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-normal">
            <button
              onClick={handlePrevious}
              disabled={!hasPreviousPage}
              className={`${baseButtonClasses} border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <IoChevronBack className="w-4 h-4" />
              <span className="hidden xs:inline">Previous</span>
            </button>
            {isLastPage ? (
              <button
                onClick={onSubmit}
                disabled={isSubmitting}
                className={`${baseButtonClasses} bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="hidden xs:inline">Submitting...</span>
                  </>
                ) : (
                  <>
                    <span className="hidden xs:inline">Submit</span>
                    <span className="xs:hidden">Submit</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className={`${baseButtonClasses} bg-green-600 hover:bg-green-700 text-white`}
              >
                <span className="hidden xs:inline">Next</span>
                <span className="xs:hidden">Next</span>
                <IoChevronForward className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
