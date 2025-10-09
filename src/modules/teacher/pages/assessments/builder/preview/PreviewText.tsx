import { type ReactElement } from "react";
import { AssessmentContent } from "../../../../../core/types/assessment/assessment.type";

type PreviewTextProps = {
  content: AssessmentContent;
};

export default function PreviewText({
  content,
}: PreviewTextProps): ReactElement {
  const data = content.data as string;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-sm border border-white dark:border-gray-700 shadow-sm">
      <div
        className="prose dark:prose-invert max-w-none text-gray-900 dark:text-gray-100"
        dangerouslySetInnerHTML={{ __html: data }}
      />
    </div>
  );
}
