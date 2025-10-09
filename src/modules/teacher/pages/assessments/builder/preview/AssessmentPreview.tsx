import { type ReactElement } from "react";
import PreviewHeader from "./PreviewHeader";
import PreviewContent from "./PreviewContent";
import { usePreview } from "../../../../../core/contexts/preview/preview.context";
import PreviewNavigation from "./PreviewNavigation";

export default function AssessmentPreview(): ReactElement {
  const { isOpen, currentAssessment, closePreview, mode } = usePreview();

  // show int preview mode
  if (!isOpen || mode !== "preview" || !currentAssessment) return <></>;

  return (
    <div className="fixed inset-0 bg-black/80  flex items-center justify-center z-50 p-4">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-sm w-full max-w-6xl h-[90vh] flex flex-col shadow-sm transition-colors duration-200">
        {/* header */}
        <PreviewHeader assessment={currentAssessment} onClose={closePreview} />

        {/* content */}
        <div className="flex-1 overflow-y-auto p-6">
          <PreviewContent assessment={currentAssessment} />
        </div>

        {/* navigation */}
        <PreviewNavigation />
      </div>
    </div>
  );
}
