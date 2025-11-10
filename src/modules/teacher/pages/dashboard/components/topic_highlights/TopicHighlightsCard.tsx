import { FaMedal } from "react-icons/fa";
import { IoWarning } from "react-icons/io5";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import CircularProgress from "../../../../../core/components/charts/CircularProgress";
import { useTeacherTopicHighlights } from "../../../../services/teacher-stats.service";
import { useAdminTopicHighlights } from "@/modules/admin/services/admin-stats.service";
import { ReactElement } from "react";

export function TopicHighlightsCardSkeleton(): ReactElement {
  return (
    <Card className="p-2 flex flex-col">
      <CardHeader className="p-0 pb-4">
        <Skeleton className="h-4 w-32" />
      </CardHeader>

      <CardContent className="p-0 flex-1">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-around">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex-1 flex flex-col items-center text-center justify-between gap-2"
            >
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-[80px] w-[80px] rounded-full" />
              <div className="flex gap-4 text-xs">
                <div className="flex flex-col items-center">
                  <Skeleton className="h-3 w-10 mb-1" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <div className="flex flex-col items-center">
                  <Skeleton className="h-3 w-10 mb-1" />
                  <Skeleton className="h-3 w-8" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

type TopicHighlightsCardProps = {
  classes?: string;
  userType: "admin" | "teacher";
  userId: string;
};

export default function TopicHighlightsCard({
  classes,
  userType,
  userId,
}: TopicHighlightsCardProps) {
  const useTopicHighlights =
    userType === "teacher"
      ? useTeacherTopicHighlights
      : useAdminTopicHighlights;
  const { data: topicHighlights, isLoading } = useTopicHighlights(userId);

  if (isLoading) return <TopicHighlightsCardSkeleton />;

  if (!topicHighlights?.hasData) {
    return (
      <Card className={`${classes ?? ""} p-2 flex flex-col`}>
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-sm font-medium text-foreground">
            Topic Performance
          </CardTitle>
        </CardHeader>

        <CardContent className="flex h-full items-center justify-center py-8">
          <p className="text-muted-foreground text-sm">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const { highest, lowest } = topicHighlights;

  return (
    <Card className={`${classes ?? ""} p-2 flex flex-col`}>
      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-sm text-foreground">
          Topic Performance
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 flex-1">
        <div className="flex flex-col h-full md:flex-row gap-4">
          <div className="flex-1 flex flex-col items-center text-center justify-between">
            <div className="flex items-center gap-2 mb-2" title={highest.title}>
              <div className="p-1.5 bg-green-50 rounded-full">
                <FaMedal className="w-3.5 h-3.5 text-green-600" />
              </div>
              <span className="text-xs font-medium text-foreground truncate max-w-[120px]">
                {highest.title}
              </span>
            </div>

            <div className="mb-2">
              <CircularProgress
                progress={highest.correctness}
                color="#10b981"
                size={80}
                strokeWidth={6}
              />
            </div>

            <div className="flex gap-3 text-xs">
              <div>
                <div className="text-muted-foreground">Stage</div>
                <div className="font-semibold">{highest.stage}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Attempts</div>
                <div className="font-semibold">{highest.attempts}</div>
              </div>
            </div>
          </div>

          <Separator
            orientation="vertical"
            className="h-auto hidden md:block"
          />
          <Separator
            orientation="horizontal"
            className="h-0.5 block md:hidden"
          />

          <div className="flex-1 flex flex-col items-center text-center justify-between">
            <div className="flex items-center gap-2 mb-2" title={lowest.title}>
              <div className="p-1.5 bg-amber-50 rounded-full">
                <IoWarning className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <span className="text-xs font-medium text-foreground truncate max-w-[120px]">
                {lowest.title}
              </span>
            </div>

            <div className="mb-2">
              <CircularProgress
                progress={lowest.correctness}
                color="#f59e0b"
                size={80}
                strokeWidth={6}
              />
            </div>

            <div className="flex gap-3 text-xs">
              <div>
                <div className="text-muted-foreground">Stage</div>
                <div className="font-semibold">{lowest.stage}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Attempts</div>
                <div className="font-semibold">{lowest.attempts}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
