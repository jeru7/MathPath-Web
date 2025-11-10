import { type ReactElement } from "react";
import { FaCircle } from "react-icons/fa";
import { differenceInDays, formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { StudentActivity as StudentActivityType } from "@/modules/core/types/activity/activity.type";
import { getActivityKeyword } from "@/modules/teacher/pages/dashboard/utils/teacher-activity.util";
import { capitalizeWord } from "@/modules/core/utils/string.util";

type StudentActivityProps = {
  activity: StudentActivityType;
};

export default function StudentActivity({
  activity,
}: StudentActivityProps): ReactElement {
  const getRelativeTime = (date: Date): string => {
    const diffInDays = differenceInDays(new Date(), date);
    if (diffInDays === 0) return formatDistanceToNow(date, { addSuffix: true });
    if (diffInDays === 1) return "yesterday";
    return `${diffInDays} days ago`;
  };

  const getActivityBadgeVariant = (type: string) => {
    switch (type.toLowerCase()) {
      case "assessment":
        return "default";
      case "stage":
        return "secondary";
      case "badge":
        return "outline";
      case "level":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <article className="flex gap-4 items-start p-4 group hover:bg-muted/30 transition-colors rounded-lg border border-border/50">
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-foreground text-sm leading-relaxed">
              You {getActivityKeyword(activity.type)}{" "}
              <span className="font-medium text-primary">
                {activity.highlight}
              </span>
            </p>

            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant={getActivityBadgeVariant(activity.type)}
                className="font-medium px-2 text-xs h-5"
              >
                {capitalizeWord(activity.type)}
              </Badge>

              <FaCircle className="w-1 h-1 text-muted-foreground" />

              <p className="text-muted-foreground text-xs">
                {getRelativeTime(new Date(activity.date))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
