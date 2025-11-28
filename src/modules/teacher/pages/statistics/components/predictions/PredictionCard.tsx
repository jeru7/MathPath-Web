import { type ReactElement } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiBarChart2 } from "react-icons/fi";

interface PredictionsCardProps {
  onViewPredictions: () => void;
}

export default function PredictionsCard({
  onViewPredictions,
}: PredictionsCardProps): ReactElement {
  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="p-3">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div>
            <CardTitle className="text-lg font-semibold">
              Performance Predictions
            </CardTitle>
            <p className="text-xs lg:text-sm text-muted-foreground mt-1">
              Topic performance trends and future projections
            </p>
          </div>

          <Button
            onClick={onViewPredictions}
            className="flex items-center gap-2 w-fit"
            variant="outline"
          >
            <FiBarChart2 className="h-4 w-4" />
            View Predictions
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
