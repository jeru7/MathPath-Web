import { useState, type ReactElement } from "react";
import {
  AreaChart,
  Area,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  CartesianGrid,
} from "recharts";
import { capitalizeWord } from "../../../../../core/utils/string.util";
import { useTeacherOnlineTrend } from "../../../../services/teacher-stats.service";
import { useAdminOnlineTrend } from "@/modules/admin/services/admin-stats.service";
import { formatHour, getMonthName } from "../../../../../core/utils/date.util";
import {
  OnlineTrendRange,
  OnlineTrendResultDay,
  OnlineTrendResultToday,
} from "../../../../types/student-online-trend.type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type ActivityTrendProps = {
  classes?: string;
  userType: "teacher" | "admin";
  userId: string;
};

export function StudentOnlineTrendSkeleton({
  classes,
}: {
  classes?: string;
}): ReactElement {
  return (
    <Card className={`${classes ?? ""} p-2`}>
      <CardHeader className="flex flex-row items-center justify-between p-0 pb-2">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-6 w-12 rounded" />
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <Skeleton className="h-[300px] w-full rounded-md" />
      </CardContent>
    </Card>
  );
}

export default function StudentOnlineTrend({
  classes,
  userType,
  userId,
}: ActivityTrendProps): ReactElement {
  const [range, setRange] = useState<OnlineTrendRange>("today");

  const useOnlineTrendHook =
    userType === "teacher" ? useTeacherOnlineTrend : useAdminOnlineTrend;
  const { data: activityTrend, isLoading } = useOnlineTrendHook(userId, range);

  if (isLoading) return <StudentOnlineTrendSkeleton classes={classes} />;

  const chartData = activityTrend?.map((d) => {
    if (range === "today") {
      return { ...d, label: formatHour((d as OnlineTrendResultToday).hour) };
    }
    if ((d as OnlineTrendResultDay).date) {
      const monthName = getMonthName((d as OnlineTrendResultDay).date.month);
      return {
        ...d,
        label: `${monthName} ${(d as OnlineTrendResultDay).date.day}`,
      };
    }
    return { ...d, label: "N/A" };
  });

  return (
    <Card className={`${classes ?? ""} p-2`}>
      <CardHeader className="flex flex-row items-center justify-between p-0 pb-2">
        <CardTitle className="text-sm font-semibold self-start">
          Student Online Trend
        </CardTitle>
        {activityTrend && activityTrend.length > 0 && (
          <Tabs
            value={range}
            onValueChange={(value) => setRange(value as OnlineTrendRange)}
            className="w-auto"
          >
            <TabsList className="grid w-full grid-cols-3">
              {["today", "7d", "2w"].map((item) => (
                <TabsTrigger key={item} value={item} className="text-xs">
                  {capitalizeWord(item)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
      </CardHeader>

      <CardContent className="pt-4">
        <div className="flex flex-col flex-1 overflow-x-auto">
          <div
            className={`flex flex-col min-h-[300px] flex-1 ${activityTrend && activityTrend.length > 0 ? "min-w-[1000px]" : "w-full"}`}
          >
            {activityTrend && activityTrend.length > 0 ? (
              <ResponsiveContainer className="w-full flex-1">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -30, bottom: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f0f0f0"
                    className="dark:stroke-gray-600"
                  />
                  <XAxis
                    dataKey="label"
                    tick={{
                      fontSize: 12,
                      fontWeight: 600,
                      dy: 10,
                      fill: "#6b7280",
                    }}
                    className="dark:text-gray-300"
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{
                      fontSize: 12,
                      fontWeight: 600,
                      dx: -10,
                      fill: "#6b7280",
                    }}
                    className="dark:text-gray-300"
                  />
                  <Tooltip
                    content={({ active, payload, label }) =>
                      active && payload && payload.length ? (
                        <Card className="border shadow-lg">
                          <CardContent className="p-3">
                            <div className="flex flex-col gap-1">
                              <p className="font-semibold">{label}</p>
                              <Badge variant="secondary" className="w-fit">
                                Online: {payload[0].value}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ) : null
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="onlineCount"
                    stroke="#22c55e"
                    fill="#bbf7d0"
                    className="dark:stroke-green-400 dark:fill-green-400/20"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-1 items-center justify-center h-[300px]">
                <p className="text-muted-foreground italic">
                  No data available.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
