import { useEffect, useState, type ReactElement } from "react";
import { TeacherStudentActivity } from "../../../../../core/types/activity/activity.type";
import TeacherActivity from "./TeacherActivity";
import { isAfter, subDays } from "date-fns";
import { formatToPhDate } from "../../../../../core/utils/date.util";
import ModalOverlay from "../../../../../core/components/modal/ModalOverlay";
import { FaTimes } from "react-icons/fa";

type ActivityDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  activities: TeacherStudentActivity[];
  onFilterChange: (activities: TeacherStudentActivity[]) => void;
  allActivities: TeacherStudentActivity[];
};

type TimeFilter = "today" | "7days" | "14days" | "all";

export default function ActivityDetailsModal({
  isOpen,
  onClose,
  activities,
  onFilterChange,
  allActivities,
}: ActivityDetailsModalProps): ReactElement {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");

  useEffect(() => {
    if (timeFilter === "all") {
      onFilterChange(allActivities);
      return;
    }

    const now = new Date();
    let filterDate: Date;

    switch (timeFilter) {
      case "today":
        filterDate = subDays(now, 1);
        break;
      case "7days":
        filterDate = subDays(now, 7);
        break;
      case "14days":
        filterDate = subDays(now, 14);
        break;
      default:
        filterDate = subDays(now, 1);
    }

    const filtered = allActivities.filter((activity) => {
      const activityDate = formatToPhDate(activity.date);
      return isAfter(activityDate, filterDate);
    });

    onFilterChange(filtered);
  }, [timeFilter, allActivities, onFilterChange]);

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-sm w-full max-w-2xl mx-4 flex flex-col shadow-xl">
        {/* header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
            Activities
          </h2>
          <div className="flex items-center gap-4">
            {/* dropdown */}
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="14days">Last 14 Days</option>
            </select>

            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* activity list */}
        <div className="flex flex-1 overflow-y-auto p-6 h-full min-h-92 max-h-[60vh]">
          <div className="relative flex flex-col w-full flex-1">
            {/* vertical line */}
            {activities && activities.length > 0 && (
              <div
                className="absolute left-2 top-0 w-1 rounded-full bg-[var(--secondary-green)]"
                style={{ height: "calc(100% - 2rem)" }}
              ></div>
            )}

            {/* list */}
            {activities && activities.length > 0 ? (
              <section className="flex-col flex pl-8 h-full gap-4">
                {activities.map((activity) => (
                  <TeacherActivity
                    key={activity.activityId}
                    activity={activity}
                  />
                ))}
              </section>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                  No activities found for the selected period
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
}
