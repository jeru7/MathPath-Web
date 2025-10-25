import { type ReactElement, useState } from "react";
import TeacherActivity from "../../../teacher/pages/dashboard/components/activity_list/TeacherActivity";
import { useParams } from "react-router-dom";
import { useTeacherStudentActivities } from "../../../teacher/services/teacher-student.service";
import { TeacherStudentActivity } from "../../../core/types/activity/activity.type";
import ActivityDetailsModal from "../../../teacher/pages/dashboard/components/activity_list/ActivityDetailsModal";

type ActivityListProps = {
  classes?: string;
  type: "Student" | "Teacher";
};

export default function ActivityList({
  classes,
  type,
}: ActivityListProps): ReactElement {
  const { teacherId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [filteredActivities, setFilteredActivities] = useState<
    TeacherStudentActivity[]
  >([]);

  const { data: studentActivities } = useTeacherStudentActivities(
    teacherId ?? "",
  );

  const handleViewAll = () => {
    setFilteredActivities(studentActivities || []);
    setShowModal(true);
  };

  const handleFilterChange = (filtered: TeacherStudentActivity[]) => {
    setFilteredActivities(filtered);
  };

  return (
    <>
      <article
        className={`${classes} p-2 flex flex-col h-full rounded-sm bg-white border border-white dark:bg-gray-800 dark:border-gray-700 gap-2 shadow-sm`}
      >
        <header className="w-full flex items-center justify-between">
          <p className="font-semibold text-gray-900 dark:text-gray-200">
            Recent Activity
          </p>
          {studentActivities && (
            <button
              onClick={handleViewAll}
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium px-2 py-1 rounded transition-colors hover:cursor-pointer"
            >
              View All
            </button>
          )}
        </header>

        <div
          className={`flex-1 overflow-scroll ${studentActivities && studentActivities.length > 0 ? "pr-4" : "pr-0"}`}
          style={{
            maxHeight: `${type === "Teacher" ? "550px" : "350px"}`,
          }}
        >
          <div
            className={`relative flex flex-col w-full ${studentActivities && studentActivities.length > 0 ? "h-fit" : "h-full"}`}
          >
            {/* line */}
            {studentActivities && studentActivities.length > 0 && (
              <div
                className="absolute left-2 top-0 w-1 rounded-full bg-[var(--secondary-green)]"
                style={{ height: "calc(100% - 2rem)" }}
              ></div>
            )}

            {/* list */}
            {studentActivities && studentActivities.length > 0 ? (
              <section className="flex-col flex pl-8 h-fit gap-2">
                {studentActivities.map((activity) => (
                  <TeacherActivity
                    key={activity.activityId}
                    activity={activity}
                  />
                ))}
              </section>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-900 dark:text-gray-300">
                  No Activity Available
                </p>
              </div>
            )}
          </div>
        </div>
      </article>

      <ActivityDetailsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        activities={filteredActivities}
        onFilterChange={handleFilterChange}
        allActivities={studentActivities || []}
      />
    </>
  );
}
