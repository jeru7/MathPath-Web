import { type ReactElement, useState } from "react";
import TeacherActivity from "../../../teacher/pages/dashboard/components/activity_list/TeacherActivity";
import { useParams } from "react-router-dom";
import { useTeacherStudentActivities } from "../../../teacher/services/teacher-student.service";
import ActivityDetailsModal from "../../../teacher/pages/dashboard/components/activity_list/ActivityDetailsModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

  const { data: studentActivities } = useTeacherStudentActivities(
    teacherId ?? "",
  );

  const handleViewAll = () => {
    setShowModal(true);
  };

  return (
    <>
      <Card className={`${classes} flex flex-col h-full`}>
        <CardHeader className="pb-1 px-3 pt-3">
          <div className="w-full flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">
              Recent Activity
            </CardTitle>
            {studentActivities && studentActivities.length > 0 && (
              <Button
                variant="ghost"
                onClick={handleViewAll}
                className="text-xs h-6 px-2 py-0 text-primary hover:text-primary/80"
              >
                View All
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-3 pt-0">
          <div
            className={`flex-1 overflow-auto ${studentActivities && studentActivities.length > 0 ? "pr-2" : "pr-0"}`}
            style={{
              maxHeight: `${type === "Teacher" ? "550px" : "350px"}`,
            }}
          >
            <div
              className={`relative flex flex-col w-full ${studentActivities && studentActivities.length > 0 ? "h-fit" : "h-full"}`}
            >
              {/* Timeline line */}
              {studentActivities && studentActivities.length > 0 && (
                <div
                  className="absolute left-2 top-0 w-0.5 rounded-full bg-primary"
                  style={{ height: "calc(100% - 1rem)" }}
                ></div>
              )}

              {/* Activity list */}
              {studentActivities && studentActivities.length > 0 ? (
                <section className="flex-col flex pl-6 h-fit gap-1">
                  {studentActivities.map((activity) => (
                    <TeacherActivity
                      key={activity.activityId}
                      activity={activity}
                    />
                  ))}
                </section>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">
                    No Activity Available
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <ActivityDetailsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        allActivities={studentActivities || []}
      />
    </>
  );
}
