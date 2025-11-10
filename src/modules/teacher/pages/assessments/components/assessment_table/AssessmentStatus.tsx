import { type ReactElement } from "react";
import { AssessmentStatus as Status } from "../../../../../core/types/assessment/assessment.type";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type AssessmentStatusProps = {
  status: Status | undefined;
};

export default function AssessmentStatus({
  status,
}: AssessmentStatusProps): ReactElement {
  const getVariant = () => {
    switch (status) {
      case "finished":
        return "default";
      case "in-progress":
      case "published":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "finished":
        return "Finished";
      case "in-progress":
        return "In Progress";
      case "published":
        return "Published";
      default:
        return "Draft";
    }
  };

  return (
    <Badge
      variant={getVariant()}
      className={cn(
        status === "draft" && "bg-yellow-500 hover:bg-yellow-600 text-white",
      )}
    >
      {getStatusText()}
    </Badge>
  );
}
