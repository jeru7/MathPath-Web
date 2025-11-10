import { useState, type ReactElement } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  TooltipProps,
  YAxis,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { TopicCorrectness } from "../../../../../core/types/chart.type";
import { CustomAxisTick } from "./../CustomAxisTick";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeacherTopicStats } from "@/modules/teacher/services/teacher-stats.service";
import { useAdminTopicStats } from "@/modules/admin/services/admin-stats.service";

interface ChartDataItem {
  topicName: string;
  totalAttempts: number;
  stage: number;
  avgSecondsPlayed: number;
  avgHintUsed: number;
  completionRate: number;
  correctness: TopicCorrectness;
}

function StagesStatisticsSkeleton(): ReactElement {
  return (
    <Card className="flex-1 flex flex-col overflow-hidden">
      <CardHeader className="p-3">
        <div className="flex flex-col gap-2 lg:flex-row lg:justify-between lg:items-center">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-[200px]" />
        </div>
      </CardHeader>
      <CardContent className="p-3 flex flex-col justify-around flex-1">
        <Skeleton className="h-48 w-full" />
      </CardContent>
    </Card>
  );
}

function StageCustomTooltip({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) {
  if (!active || !payload || payload.length === 0) return null;

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  const data = payload[0].payload as ChartDataItem;

  return (
    <div className="bg-background border rounded-lg shadow-lg p-4 text-sm max-w-[300px]">
      <div className="mb-3">
        <p className="font-bold text-base mb-1">Stage {data.stage}</p>
        <p className="text-muted-foreground truncate text-xs">
          {data.topicName}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Completion Rate:</span>
          <Badge
            variant="secondary"
            className="font-semibold bg-transparent text-blue-600 border-blue-600 text-nowrap"
          >
            {data.completionRate}%
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Total Attempts:</span>
          <span className="font-semibold">
            {data.totalAttempts.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Average Time:</span>
          <span className="font-semibold text-purple-600">
            {formatDuration(data.avgSecondsPlayed)}
          </span>
        </div>
      </div>
    </div>
  );
}

function StagesChart({ chartData }: { chartData: ChartDataItem[] }) {
  // Calculate the maximum completion rate for Y-axis domain
  const maxCompletionRate = Math.max(
    ...chartData.map((item) => item.completionRate),
  );
  const yAxisDomain = [
    0,
    Math.max(100, Math.ceil(maxCompletionRate / 10) * 10),
  ];

  return (
    <div className="w-full h-fit overflow-x-auto xl:overflow-x-hidden overflow-y-hidden">
      <div className="w-full min-w-[1200px] xl:min-w-min h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: -20 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="stage"
              height={60}
              interval={0}
              tick={<CustomAxisTick />}
              className="fill-muted-foreground"
            />
            <YAxis
              domain={yAxisDomain}
              className="fill-muted-foreground"
              label={{
                value: "Completion Rate (%)",
                angle: -90,
                position: "insideLeft",
                offset: -10,
                style: {
                  textAnchor: "middle",
                  fontSize: 12,
                  fill: "hsl(var(--muted-foreground))",
                },
              }}
            />
            <Tooltip content={<StageCustomTooltip />} />
            <Bar
              dataKey="completionRate"
              name="Completion Rate (%)"
              radius={[4, 4, 0, 0]}
              fill="hsl(var(--primary))"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-48 items-center justify-center border border-dashed rounded-lg">
      <div className="text-center text-muted-foreground">
        <p className="italic">No stage data available</p>
      </div>
    </div>
  );
}

type StagesStatisticsProps = {
  userType: "admin" | "teacher";
  userId: string;
};

export default function StagesStatistics({
  userType,
  userId,
}: StagesStatisticsProps): ReactElement {
  const useTopicStats =
    userType === "teacher" ? useTeacherTopicStats : useAdminTopicStats;
  const { data: topicStats, isLoading } = useTopicStats(userId);

  const [selectedSection, setSelectedSection] = useState<string>("all");

  const sectionTopicStats = topicStats?.sections;
  const overallTopicStats = topicStats?.overall;

  const sectionOptions = [
    { id: "all", name: "Overall" },
    ...(sectionTopicStats?.map((sectionStat) => ({
      id: sectionStat.sectionId,
      name: sectionStat.sectionName,
    })) || []),
  ];

  const filteredData =
    selectedSection === "all"
      ? overallTopicStats || []
      : sectionTopicStats?.find((s) => s.sectionId === selectedSection)
        ?.topicStats || [];

  const chartData = filteredData.map((topic) => ({
    topicName: topic.topic.trim(),
    totalAttempts: topic.totalAttempts,
    stage: topic.stage,
    avgSecondsPlayed: topic.avgSecondsPlayed,
    avgHintUsed: topic.avgHintUsed,
    completionRate: topic.completionRate,
    correctness: topic.correctness,
  }));

  if (isLoading) return <StagesStatisticsSkeleton />;

  return (
    <Card className="flex-1 flex flex-col overflow-hidden">
      <CardHeader className="p-3">
        <div className="flex flex-col gap-2 lg:flex-row lg:justify-between lg:items-center">
          <div>
            <CardTitle className="text-xl font-semibold">Stages</CardTitle>
            <p className="text-xs lg:text-sm text-muted-foreground mt-1">
              Student completion rates across stages
            </p>
          </div>
          <Select value={selectedSection} onValueChange={setSelectedSection}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select section..." />
            </SelectTrigger>
            <SelectContent>
              {sectionOptions.map((section) => (
                <SelectItem key={section.id} value={section.id}>
                  {section.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-3 flex flex-col justify-around flex-1">
        {chartData.length === 0 ? (
          <EmptyState />
        ) : (
          <StagesChart chartData={chartData} />
        )}
      </CardContent>
    </Card>
  );
}
