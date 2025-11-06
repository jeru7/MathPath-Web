import { type ReactElement } from "react";
import { getBadgeIcon } from "../../../../core/utils/badge/badge.util";
import { Badge } from "../../../../core/types/badge/badge.type";
import { Card, CardContent } from "@/components/ui/card";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type BadgeItemProps = {
  badge: Badge;
  studentProgress: {
    completed: boolean;
    progress: number;
    reqCompleted: number;
    dateFinished: Date | null;
  };
};

export default function BadgeItem({
  badge,
  studentProgress,
}: BadgeItemProps): ReactElement {
  const { completed, progress, reqCompleted } = studentProgress;
  const badgeIcon = getBadgeIcon(badge.type);

  const getStatusConfig = () => {
    if (completed) {
      return {
        border: "border-emerald-500",
        background: "bg-emerald-50 dark:bg-emerald-900/20",
        statusColor: "text-emerald-600",
        statusText: "Completed",
      };
    } else {
      return {
        border: "border-border",
        background: "bg-card",
        statusColor: "text-muted-foreground",
        statusText: "In Progress",
      };
    }
  };

  const status = getStatusConfig();

  return (
    <Card
      className={`flex flex-col items-center p-3 border-2 w-48 max-h-54 transition-all hover:shadow-md flex-shrink-0 ${status.border} ${status.background}`}
    >
      <CardContent className="p-0 flex flex-col items-center w-full h-full justify-between">
        {/* icon */}
        <div className="flex items-center justify-center flex-shrink-0">
          <img
            src={badgeIcon}
            alt={badge.name}
            className="min-h-10 min-w-10 max-h-16 max-w-16"
          />
        </div>

        {/* info */}
        <div className="text-center w-full flex-1 min-h-0 flex flex-col justify-center">
          <p className="font-semibold text-sm leading-tight line-clamp-2 break-words mb-1">
            {badge.name}
          </p>
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {reqCompleted}/{badge.req}
            </span>
          </div>
        </div>

        {/* bar */}
        <div className="w-full flex-shrink-0 mb-1">
          <Progress value={progress} className="h-2" />
        </div>

        {/* status */}
        <UIBadge
          variant={completed ? "default" : "secondary"}
          className={`text-xs font-semibold ${completed ? "bg-emerald-500 hover:bg-emerald-600" : ""}`}
        >
          {status.statusText}
        </UIBadge>
      </CardContent>
    </Card>
  );
}
