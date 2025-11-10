import { type ReactElement } from "react";
import PreviewHeader from "./PreviewHeader";
import PreviewContent from "./PreviewContent";
import { usePreview } from "../../../../../core/contexts/preview/preview.context";
import PreviewNavigation from "./PreviewNavigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function AssessmentPreview(): ReactElement {
  const { isOpen, currentAssessment, closePreview, mode } = usePreview();

  if (!isOpen || mode !== "preview" || !currentAssessment) return <></>;

  return (
    <Dialog open={isOpen} onOpenChange={closePreview}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 flex flex-col">
        {/* header */}
        <PreviewHeader assessment={currentAssessment} />

        {/* content */}
        <div className="flex-1 overflow-y-auto p-6">
          <PreviewContent assessment={currentAssessment} />
        </div>

        {/* navigation */}
        <PreviewNavigation />
      </DialogContent>
    </Dialog>
  );
}
