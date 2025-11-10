import { type ReactElement } from "react";
import { usePreview } from "../../../../../core/contexts/preview/preview.context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
    <Card className="rounded-none border-t rounded-b-lg">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {totalPages}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={!hasPreviousPage}
              className="min-w-20"
            >
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={!hasNextPage}
              className="min-w-20"
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
