import { type ReactElement } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { differenceInDays, formatDistanceToNow } from "date-fns";
import { AdminTeacherStudentActivity } from "../../types/activity/activity.type";
import { getProfilePicture } from "../../utils/profile-picture.util";
import { getActivityKeyword } from "@/modules/teacher/pages/dashboard/utils/teacher-activity.util";
import { capitalizeWord } from "../../utils/string.util";

type AdminTeacherActivityProps = {
  dialog?: boolean;
  activity: AdminTeacherStudentActivity;
};

export default function AdminTeacherActivity({
  dialog = false,
  activity,
}: AdminTeacherActivityProps): ReactElement {
  const getRelativeTime = (date: Date): string => {
    const diffInDays = differenceInDays(new Date(), date);
    if (diffInDays === 0) {
      return formatDistanceToNow(date, { addSuffix: true });
    }
    if (diffInDays === 1) {
      return "yesterday";
    }
    return `${diffInDays} days ago`;
  };

  return (
    <Card
      className={cn("p-4 max-h-fit", dialog ? "bg-muted/30" : "bg-background")}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full flex-shrink-0">
          <img
            src={getProfilePicture(activity.profilePicture)}
            alt="Student profile picture"
            className="w-full h-full rounded-full object-cover"
          />
        </div>

        <div className="flex-1 space-y-2">
          <p
            className={cn("text-foreground", dialog ? "text-base" : "text-sm")}
          >
            <span className="font-medium">
              {activity.firstName} {activity.lastName}
            </span>{" "}
            <span className="text-foreground/70">
              {getActivityKeyword(activity.type)}
            </span>{" "}
            <span className="font-semibold text-primary">
              {activity.highlight}
            </span>
          </p>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
              {capitalizeWord(activity.type)}
            </span>
            <span
              className={cn(
                "text-muted-foreground",
                dialog ? "text-sm" : "text-xs",
              )}
            >
              {getRelativeTime(new Date(activity.date))}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
