import { type ReactElement } from "react";
import {
  Assessment,
  AssessmentContent,
} from "../../../../../core/types/assessment/assessment.type";
import { usePreview } from "../../../../../core/contexts/preview/preview.context";
import PreviewQuestion from "./PreviewQuestion";
import PreviewImage from "./PreviewImage";
import PreviewText from "./PreviewText";

type PreviewContentProps = {
  assessment: Assessment;
};

export default function PreviewContent({
  assessment,
}: PreviewContentProps): ReactElement {
  const { currentPage } = usePreview();
  const currentPageData = assessment.pages[currentPage];

  if (!currentPageData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No content available</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      {/* title */}
      {currentPageData.title && (
        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground">
            {currentPageData.title}
          </h3>
          <div className="h-px bg-border" />
        </div>
      )}

      {/* contents */}
      <div className="space-y-6">
        {currentPageData.contents.map((content: AssessmentContent) => {
          switch (content.type) {
            case "question":
              return <PreviewQuestion key={content.id} content={content} />;
            case "image":
              return <PreviewImage key={content.id} content={content} />;
            case "text":
              return <PreviewText key={content.id} content={content} />;
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
