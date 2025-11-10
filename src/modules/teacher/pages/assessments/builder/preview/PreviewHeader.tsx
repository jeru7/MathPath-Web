import { type ReactElement } from "react";
import { Assessment } from "../../../../../core/types/assessment/assessment.type";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type PreviewHeaderProps = {
  assessment: Assessment;
};

export default function PreviewHeader({
  assessment,
}: PreviewHeaderProps): ReactElement {
  return (
    <Card className="rounded-none border-b rounded-t-lg">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {assessment.title || "Untitled Assessment"}
            </h2>

            {assessment.topic && (
              <p className="text-sm text-muted-foreground">
                Topic: {assessment.topic}
              </p>
            )}

            {assessment.description && (
              <p className="text-sm text-muted-foreground">
                {assessment.description}
              </p>
            )}

            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="secondary" className="text-xs">
                Preview Mode
              </Badge>
              <Badge variant="outline" className="text-xs">
                {assessment.pages.length} page
                {assessment.pages.length !== 1 ? "s" : ""}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
