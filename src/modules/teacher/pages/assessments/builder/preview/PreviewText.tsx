import { type ReactElement } from "react";
import { AssessmentContent } from "../../../../../core/types/assessment/assessment.type";
import { Card, CardContent } from "../../../../../../components/ui/card";

type PreviewTextProps = {
  content: AssessmentContent;
};

export default function PreviewText({
  content,
}: PreviewTextProps): ReactElement {
  const data = content.data as string;

  return (
    <Card>
      <CardContent className="p-6">
        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: data }}
        />
      </CardContent>
    </Card>
  );
}
