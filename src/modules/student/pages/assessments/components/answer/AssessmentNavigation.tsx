import { type ReactElement } from "react";
import { usePreview } from "../../../../../core/contexts/preview/preview.context";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { Button } from "../../../../../..//components/ui/button";
import { Card, CardContent } from "../../../../../..//components/ui/card";
import { Badge } from "../../../../../..//components/ui/badge";

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

  return (
    <Card className="border-t rounded-none shadow-lg">
      <CardContent className="p-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-row items-center justify-center w-full sm:w-auto gap-3">
            <Badge variant="secondary" className="text-sm">
              Page<span className="font-semibold mx-1">{currentPage + 1}</span>
              of <span className="font-semibold ml-1">{totalPages}</span>
            </Badge>

            <div className="flex items-center justify-center gap-1">
              {Array.from({ length: totalPages }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${index === currentPage
                      ? "bg-primary"
                      : index < currentPage
                        ? "bg-primary/60"
                        : "bg-muted"
                    }`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-normal">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={!hasPreviousPage}
              className="flex items-center space-x-2 min-w-[120px] sm:min-w-[140px] h-11"
            >
              <IoChevronBack className="w-4 h-4" />
              <span className="hidden xs:inline">Previous</span>
            </Button>
            {isLastPage ? (
              <Button
                onClick={onSubmit}
                disabled={isSubmitting}
                className="flex items-center space-x-2 min-w-[120px] sm:min-w-[140px] h-11"
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
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="flex items-center space-x-2 min-w-[120px] sm:min-w-[140px] h-11"
              >
                <span className="hidden xs:inline">Next</span>
                <span className="xs:hidden">Next</span>
                <IoChevronForward className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
