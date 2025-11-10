import { type ReactElement } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import TopStudentItem from "./TopStudentItem";
import { useTeacherTopStudents } from "@/modules/teacher/services/teacher-stats.service";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminTopStudents } from "@/modules/admin/services/admin-stats.service";

export function TopStudentsCardSkeleton({
  classes,
}: {
  classes?: string;
}): ReactElement {
  return (
    <Card className={`${classes ?? ""} p-2`}>
      <CardHeader className="p-0 pb-4">
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

type TopStudentsCardProps = {
  classes?: string;
  userType: "admin" | "teacher";
  userId: string;
};

export default function TopStudentsCard({
  classes,
  userType,
  userId,
}: TopStudentsCardProps): ReactElement {
  const useTopStudents =
    userType === "admin" ? useAdminTopStudents : useTeacherTopStudents;
  const { data: topStudents, isLoading } = useTopStudents(userId);

  if (isLoading) return <TopStudentsCardSkeleton classes={classes} />;

  return (
    <Card className={`${classes ?? ""} p-2 flex flex-col`}>
      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-sm text-foreground">Top Students</CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-full">
        {topStudents && topStudents.length > 0 ? (
          <div className="space-y-2">
            {topStudents.map((student, index) => (
              <TopStudentItem
                key={student.id}
                student={student}
                rank={index + 1}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-sm">
              No student data available
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
