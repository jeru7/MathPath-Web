import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ActiveStudentsPie from "./ActiveStudentsPie";
import { useTeacherActiveStudent } from "../../../../services/teacher-stats.service";
import { useAdminActiveStudent } from "@/modules/admin/services/admin-stats.service";
import { ReactElement } from "react";

const COLORS = ["#347928", "#99D58D", "#F09319", "#FFE31A", "#F6FB7A"];
const OFFLINE_COLOR = "#a9a9a9";

export function ActiveStudentsCardSkeleton() {
  return (
    <Card className="p-2 overflow-hidden">
      <CardHeader className="p-0">
        <Skeleton className="h-4 w-28 mb-2" />
      </CardHeader>
      <CardContent className="p-0 flex items-center justify-center gap-4">
        <Skeleton className="h-[150px] w-[150px] rounded-full" />
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

type ActiveStudentsCardProps = {
  classes?: string;
  userType: "teacher" | "admin";
  userId: string;
};

export default function ActiveStudentsCard({
  classes,
  userType,
  userId,
}: ActiveStudentsCardProps): ReactElement {
  const useActiveStudentHook =
    userType === "teacher" ? useTeacherActiveStudent : useAdminActiveStudent;

  const { data: activeStudents, isLoading } = useActiveStudentHook(userId);

  if (isLoading || !activeStudents) {
    return <ActiveStudentsCardSkeleton />;
  }

  const chartData =
    activeStudents.totalPercentage === 0
      ? [{ name: "Offline", percentage: 100 }]
      : (activeStudents.sections ?? []);

  const sectionColors =
    activeStudents.totalPercentage === 0
      ? [OFFLINE_COLOR]
      : [...COLORS.slice(0, chartData.length), OFFLINE_COLOR];

  return (
    <Card className={`${classes ?? ""} p-2 overflow-hidden`}>
      <CardHeader className="p-0">
        <CardTitle className="text-sm font-semibold">Active Students</CardTitle>
      </CardHeader>

      <CardContent className="p-0 h-full flex items-center justify-center">
        <div className="flex gap-2 xl:gap-3 items-center justify-center">
          <ActiveStudentsPie
            classes="relative min-w-[150px]"
            chartData={chartData}
            sectionColors={sectionColors}
            totalPercentage={activeStudents.totalPercentage ?? 0}
          />

          <section className="flex flex-col justify-center p-2 text-sm">
            {(activeStudents.sections ?? []).map((section, index) => (
              <div key={index} className="flex items-center gap-2 mb-1">
                <Badge
                  className="w-3 h-3 rounded-full p-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-foreground truncate max-w-[100px]">
                  {section.name}
                </span>
              </div>
            ))}

            <div className="flex items-center gap-2">
              <Badge
                className="w-3 h-3 rounded-full p-0"
                style={{ backgroundColor: OFFLINE_COLOR }}
              />
              <span className="text-foreground">Offline</span>
            </div>
          </section>
        </div>
      </CardContent>
    </Card>
  );
}
