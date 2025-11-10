import { useState, type ReactElement, useMemo, useCallback, memo } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  TooltipProps,
  YAxis,
  Cell,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import {
  TopicCorrectness,
  TopicStats,
} from "../../../../../core/types/chart.type";
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
  stage: number;
  avgSecondsPlayed: number;
  completionRate: number;
  correctness: TopicCorrectness;
  avgCorrectPercentage: number;
}

const CORRECTNESS_COLORS = {
  excellent: "#22c55e",
  good: "#3b82f6",
  average: "#f59e0b",
  poor: "#ef4444",
};

// Skeleton Component
function TopicStatisticsSkeleton(): ReactElement {
  return (
    <Card className="flex-1 flex flex-col overflow-hidden pb-4">
      <CardHeader className="p-3">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-[200px]" />
        </div>
      </CardHeader>
      <CardContent className="p-3 flex flex-col justify-around flex-1">
        <Skeleton className="h-48 w-full" />
        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 text-xs text-muted-foreground mt-4 px-4 sm:px-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

// Memoized tooltip component
const TopicCustomTooltip = memo(function TopicCustomTooltip({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload as ChartDataItem;

    return (
      <div className="bg-background border rounded-lg shadow-lg p-3 text-xs max-w-[400px]">
        <p className="font-bold text-sm mb-2 text-nowrap truncate">
          {data.topicName}
        </p>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Avg Correct:</span>
            <Badge
              variant="outline"
              className={
                data.avgCorrectPercentage >= 80
                  ? "text-green-600 border-green-600"
                  : data.avgCorrectPercentage >= 60
                    ? "text-blue-600 border-blue-600"
                    : data.avgCorrectPercentage >= 40
                      ? "text-amber-600 border-amber-600"
                      : "text-red-600 border-red-600"
              }
            >
              {data.avgCorrectPercentage.toFixed(1)}%
            </Badge>
          </div>

          <div className="border-t border-border pt-1.5">
            <p className="font-semibold mb-1 text-[11px]">By Difficulty:</p>
            <div className="grid grid-cols-3 gap-1 text-[10px]">
              <div className="text-center">
                <div className="text-green-600 font-semibold">Easy</div>
                <div className="text-muted-foreground">
                  {data.correctness.easy.correctPercentage}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-amber-600 font-semibold">Med</div>
                <div className="text-muted-foreground">
                  {data.correctness.medium.correctPercentage}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-red-600 font-semibold">Hard</div>
                <div className="text-muted-foreground">
                  {data.correctness.hard.correctPercentage}%
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between text-[11px] border-t border-border pt-1.5">
            <span className="text-muted-foreground">Stage:</span>
            <span className="font-semibold">{data.stage}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
});

// Memoized chart component
const TopicChart = memo(function TopicChart({
  chartData,
}: {
  chartData: ChartDataItem[];
}) {
  const getBarColor = useCallback((correctness: number): string => {
    if (correctness >= 80) return CORRECTNESS_COLORS.excellent;
    if (correctness >= 60) return CORRECTNESS_COLORS.good;
    if (correctness >= 40) return CORRECTNESS_COLORS.average;
    return CORRECTNESS_COLORS.poor;
  }, []);

  return (
    <div className="w-full h-fit overflow-x-auto xl:overflow-hidden">
      <div className="w-full min-w-[1200px] xl:min-w-min h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: -20,
            }}
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
              domain={[0, 100]}
              className="fill-muted-foreground"
              label={{
                value: "Avg. Correctness (%)",
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
            <Tooltip content={<TopicCustomTooltip />} />
            <Bar
              dataKey="avgCorrectPercentage"
              name="Avg. Correctness (%)"
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(entry.avgCorrectPercentage)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

// Memoized empty state component
const EmptyState = memo(function EmptyState() {
  return (
    <div className="flex h-48 items-center justify-center border border-dashed rounded-lg">
      <div className="text-center text-muted-foreground">
        <p className="italic">No topic data available</p>
      </div>
    </div>
  );
});

// Memoized legend component
const CorrectnessLegend = memo(function CorrectnessLegend() {
  return (
    <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 text-xs text-muted-foreground mt-4 px-4 sm:px-2">
      <div className="flex items-center gap-1 sm:gap-2">
        <div className="w-3 h-3 rounded bg-green-500 flex-shrink-0"></div>
        <span className="whitespace-nowrap">Excellent (80-100%)</span>
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <div className="w-3 h-3 rounded bg-blue-500 flex-shrink-0"></div>
        <span className="whitespace-nowrap">Good (60-79%)</span>
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <div className="w-3 h-3 rounded bg-amber-500 flex-shrink-0"></div>
        <span className="whitespace-nowrap">Average (40-59%)</span>
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <div className="w-3 h-3 rounded bg-red-500 flex-shrink-0"></div>
        <span className="whitespace-nowrap">Poor (0-39%)</span>
      </div>
    </div>
  );
});

type TopicStatisticsProps = {
  userType: "admin" | "teacher";
  userId: string;
};

export default function TopicStatistics({
  userType,
  userId,
}: TopicStatisticsProps): ReactElement {
  const useTopicStats =
    userType === "teacher" ? useTeacherTopicStats : useAdminTopicStats;
  const { data: topicStats, isLoading } = useTopicStats(userId);
  const [selectedSection, setSelectedSection] = useState<string>("all");

  const sectionTopicStats = topicStats?.sections;
  const overallTopicStats = topicStats?.overall;

  // Helper function for transforming topic stats
  const getTopicStats = useCallback(
    (topics: TopicStats[] = []): ChartDataItem[] => {
      return topics.map((topic) => {
        const avgCorrectness =
          (topic.correctness.easy.correctPercentage +
            topic.correctness.medium.correctPercentage +
            topic.correctness.hard.correctPercentage) /
          3;

        return {
          topicName: topic.topic.trim(),
          totalAttempts: topic.totalAttempts,
          stage: topic.stage,
          avgSecondsPlayed: topic.avgSecondsPlayed,
          avgHintUsed: topic.avgHintUsed,
          completionRate: topic.completionRate,
          correctness: topic.correctness,
          avgCorrectPercentage: avgCorrectness,
        };
      });
    },
    [],
  );

  // Memoize section options
  const sectionOptions = useMemo(() => {
    const baseOptions = [{ id: "all", name: "Overall" }];
    if (!sectionTopicStats) return baseOptions;

    return [
      ...baseOptions,
      ...sectionTopicStats.map((sectionStat) => ({
        id: sectionStat.sectionId,
        name: sectionStat.sectionName,
      })),
    ];
  }, [sectionTopicStats]);

  // Memoize filtered data
  const filteredData = useMemo(() => {
    if (selectedSection === "all") {
      return overallTopicStats || [];
    } else {
      const sectionData = sectionTopicStats?.find(
        (section) => section.sectionId === selectedSection,
      );
      return sectionData?.topicStats || [];
    }
  }, [selectedSection, overallTopicStats, sectionTopicStats]);

  // Memoize chart data
  const chartData = useMemo(
    () => getTopicStats(filteredData),
    [filteredData, getTopicStats],
  );

  // Memoize select change handler
  const handleSectionChange = useCallback((value: string) => {
    setSelectedSection(value);
  }, []);

  if (isLoading) {
    return <TopicStatisticsSkeleton />;
  }

  return (
    <Card className="flex-1 flex flex-col overflow-hidden pb-4">
      <CardHeader className="p-3">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div>
            <CardTitle className="text-lg font-semibold">Topics</CardTitle>
            <p className="text-xs lg:text-sm text-muted-foreground mt-1">
              Student answer correctness rates across stages
            </p>
          </div>

          <Select value={selectedSection} onValueChange={handleSectionChange}>
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
          <TopicChart chartData={chartData} />
        )}
        <CorrectnessLegend />
      </CardContent>
    </Card>
  );
}
