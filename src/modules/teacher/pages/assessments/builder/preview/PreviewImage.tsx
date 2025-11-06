import { type ReactElement } from "react";
import { AssessmentContent } from "../../../../../core/types/assessment/assessment.type";
import { Card, CardContent } from "../../../../../../components/ui/card";

type PreviewImageProps = {
  content: AssessmentContent;
};

export default function PreviewImage({
  content,
}: PreviewImageProps): ReactElement {
  const { secureUrl } = content.data as { secureUrl: string; publicId: string };

  return (
    <Card className="flex justify-center">
      <CardContent className="p-6">
        <img
          src={secureUrl}
          alt="Assessment content"
          className="max-w-full h-auto max-h-96 object-contain rounded"
        />
      </CardContent>
    </Card>
  );
}
