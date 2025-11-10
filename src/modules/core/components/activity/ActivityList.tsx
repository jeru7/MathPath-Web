import { type ReactElement, useState } from "react";
import ActivityDetailsModal from "../../../teacher/pages/dashboard/components/activity_list/ActivityDetailsModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  StudentActivity as StudentActivityType,
  AdminTeacherStudentActivity,
} from "../../types/activity/activity.type";
import StudentActivity from "@/modules/student/pages/dashboard/activity/StudentActivity";
import AdminTeacherActivity from "./AdminTeacherActivity";

type ActivityListProps = {
  activities: StudentActivityType[] | AdminTeacherStudentActivity[];
  classes?: string;
  type: "Student" | "Teacher" | "Admin";
  isLoading?: boolean;
};

export function ActivityListSkeleton({ classes }: { classes?: string }) {
  return (
    <Card className={`${classes} h-full border flex flex-col`}>
      <CardHeader className="p-2 pb-4">
        <div className="w-full flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-7 w-16" />
        </div>
      </CardHeader>
      <CardContent className="p-0 h-full flex-1 flex flex-col">
        <div className="px-4 flex-1">
          <div className="flex flex-col w-full flex-1 h-full space-y-3">
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="flex items-start space-x-3 py-2">
                <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="px-4 py-3 border-t bg-muted/20">
          <Skeleton className="h-3 w-40 mx-auto" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function ActivityList({
  activities,
  classes,
  type,
  isLoading = false,
}: ActivityListProps): ReactElement {
  const [showModal, setShowModal] = useState(false);
  const [itemsToShow] = useState(5);

  const handleViewAll = () => {
    setShowModal(true);
  };

  if (isLoading) {
    return <ActivityListSkeleton classes={classes} />;
  }

  const displayedActivities = activities.slice(0, itemsToShow);
  const hasMoreActivities = activities.length > itemsToShow;

  const renderActivity = (
    activity: StudentActivityType | AdminTeacherStudentActivity,
  ) => {
    switch (type) {
      case "Teacher":
        return (
          <AdminTeacherActivity
            key={activity.activityId}
            activity={activity as AdminTeacherStudentActivity}
          />
        );
      case "Student":
        return (
          <StudentActivity
            key={activity.activityId}
            activity={activity as StudentActivityType}
          />
        );
      case "Admin":
        return (
          <AdminTeacherActivity
            key={activity.activityId}
            activity={activity as AdminTeacherStudentActivity}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Card className={`${classes} h-full border flex flex-col`}>
        <CardHeader className="p-2 pb-4">
          <div className="w-full flex items-center justify-between">
            <CardTitle className="text-sm self-start">
              Recent Activity
            </CardTitle>
            {hasMoreActivities && (
              <Button
                variant="ghost"
                onClick={handleViewAll}
                className="text-xs h-7 px-3 py-1 text-primary hover:text-primary/80 hover:bg-primary/5 rounded-md transition-colors"
              >
                View All
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0 h-full flex-1 flex flex-col">
          <div className="px-4 flex-1">
            <div className="flex flex-col w-full flex-1 h-full">
              {displayedActivities.length > 0 ? (
                <section className="flex flex-col flex-1 gap-2 md:gap-4">
                  {displayedActivities.map((activity) =>
                    renderActivity(activity),
                  )}
                </section>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground text-sm text-center">
                    No Activity Available
                  </p>
                </div>
              )}
            </div>
          </div>

          {hasMoreActivities && (
            <div className="px-4 py-3 mt-2 border-t bg-muted/20">
              <p className="text-xs text-muted-foreground text-center">
                Showing {displayedActivities.length} of {activities.length}{" "}
                activities
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <ActivityDetailsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        allActivities={(activities as AdminTeacherStudentActivity[]) || []}
      />
    </>
  );
}
