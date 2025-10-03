import { type ReactElement } from "react";
import { FaCircle } from "react-icons/fa";
import { getProfilePicture } from "../../../../../core/utils/profile-picture.util";
import { TeacherStudentActivity } from "../../../../../core/types/activity/activity.type";
import { getActivityKeyword } from "../../utils/teacher-activity.util";
import { capitalizeWord } from "../../../../../core/utils/string.util";
import { differenceInDays, formatDistanceToNow } from "date-fns";
import { formatToPhDate } from "../../../../../core/utils/date.util";

type TeacherActivityProps = {
  activity: TeacherStudentActivity;
};

export default function TeacherActivity({
  activity,
}: TeacherActivityProps): ReactElement {
  const getRelativeTime = (date: Date): string => {
    const diffInDays = differenceInDays(new Date(), date);

    if (diffInDays === 0) {
      // Same day → show "x minutes/hours ago"
      return formatDistanceToNow(date, { addSuffix: true });
    }
    if (diffInDays === 1) {
      return "yesterday";
    }
    return `${diffInDays} days ago`;
  };

  return (
    <article className="flex gap-2 items-center py-2 justify-between">
      <div className="absolute left-0.5 w-4 h-4 bg-[var(--secondary-green)] rounded-full z-10 transform"></div>
      <div className="flex gap-2 items-center">
        <div className="w-8 h-8 rounded-full">
          <img
            src={getProfilePicture(activity.profilePicture)}
            alt="Student profile picture."
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <p className="text-xs">
            {activity.firstName} {activity.lastName}{" "}
            {getActivityKeyword(activity.type)}{" "}
            <span className="font-semibold">{activity.highlight}</span>.
          </p>
          <div className="text-gray-400 flex items-center gap-1">
            <p className="text-xs">
              {getRelativeTime(formatToPhDate(activity.date))}
            </p>
            <FaCircle className="w-1 h-1" />
            <p className="text-xs font-bold">{capitalizeWord(activity.type)}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
