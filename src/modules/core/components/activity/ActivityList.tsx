import { type ReactElement } from "react";
// import StudentActivity from "./StudentActivity";
import TeacherActivity from "../../../teacher/pages/dashboard/components/activity_list/TeacherActivity";
import { useTeacherStudentActivities } from "../../../teacher/services/teacher.service";
import { useParams } from "react-router-dom";

interface IActivityListProps {
  classes?: string;
  type: "Student" | "Teacher";
}

export default function ActivityList({
  classes,
  type,
}: IActivityListProps): ReactElement {
  const { teacherId } = useParams();

  const { data: studentActivities } = useTeacherStudentActivities(
    teacherId ?? "",
  );

  return (
    <article
      className={`${classes} p-2 flex flex-col h-full bg-white rounded-sm gap-2 shadow-sm`}
    >
      <header className="w-full flex items-center justify-between">
        <p className="font-semibold">Recent Activity</p>
      </header>

      <div
        className="h-full overflow-scroll pr-4 min-h-[400px]"
        style={{
          maxHeight: `${type === "Teacher" ? "475px" : "350px"}`,
        }}
      >
        <div className="relative flex flex-col w-full h-fit">
          {/* Vertical Line */}
          <div
            className="absolute left-2 top-0 w-1 rounded-full bg-[var(--secondary-green)]"
            style={{ height: "calc(100% - 2rem)" }}
          ></div>

          {/* Activity List */}
          <section className="flex-col flex pl-8 h-fit gap-2">
            {studentActivities &&
              studentActivities.length > 0 &&
              studentActivities?.map((activity) => (
                <TeacherActivity
                  key={activity.activityId}
                  activity={activity}
                />
              ))}
          </section>
        </div>
      </div>
    </article>
  );
}
