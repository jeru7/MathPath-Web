import { type ReactElement } from "react";
import { AssessmentContent } from "../../../../../core/types/assessment/assessment.type";

type PreviewImageProps = {
  content: AssessmentContent;
};

export default function PreviewImage({
  content,
}: PreviewImageProps): ReactElement {
  const { secureUrl } = content.data as { secureUrl: string; publicId: string };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-sm border border-white dark:border-gray-700 shadow-sm flex justify-center">
      <img
        src={secureUrl}
        alt="Assessment content"
        className="max-w-full h-auto max-h-96 object-contain rounded"
      />
    </div>
  );
}
