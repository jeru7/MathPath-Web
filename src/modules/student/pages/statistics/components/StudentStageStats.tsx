import { type ReactElement } from "react";
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
import { useStudentTopicStats } from "../../../services/student-stats.service";
import {
  TopicCorrectness,
  TopicStats,
} from "../../../../core/types/chart.type";
import { CustomAxisTick } from "../../../../teacher/pages/statistics/components/CustomAxisTick";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type StudentStageStatsProps = {
  studentId: string;
};

export default function StudentStageStats({
  studentId,
}: StudentStageStatsProps): ReactElement {
  const { data: studentTopicStats, isLoading } =
    useStudentTopicStats(studentId);

  const chartData = getTopicStats(studentTopicStats || []);

  if (isLoading) {
    return (
      <Card className="flex-1">
        <CardContent className="flex items-center justify-center h-48 p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading stage statistics...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full w-full">
      <CardHeader className="p-3">
        <CardTitle className="text-lg font-semibold">Stage</CardTitle>
      </CardHeader>
      <CardContent className="p-3 flex flex-col justify-around flex-1">
        {chartData.length === 0 ? (
          <div className="flex h-48 items-center justify-center border border-dashed rounded-lg">
            <div className="text-center text-muted-foreground">
              <div className="text-4xl mb-2">📊</div>
              <p className="italic">No stage data available</p>
            </div>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <div className="min-w-[1200px] h-48">
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
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
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
                  <Tooltip content={<StudentStageCustomTooltip />} />
                  <Bar
                    dataKey="completionRate"
                    name="Completion Rate (%)"
                    radius={[4, 4, 0, 0]}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getCompletionColor(entry.completionRate)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Completion Rate Legend */}
        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 text-xs text-muted-foreground mt-2 px-4 sm:px-2">
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
      </CardContent>
    </Card>
  );
}

interface ChartDataItem {
  topicName: string;
  totalAttempts: number;
  stage: number;
  avgSecondsPlayed: number;
  avgHintUsed: number;
  completionRate: number;
  correctness: TopicCorrectness;
}

const COMPLETION_COLORS = {
  excellent: "#22c55e", // green-500
  good: "#3b82f6", // blue-500
  average: "#f59e0b", // amber-500
  poor: "#ef4444", // red-500
};

const getCompletionColor = (completionRate: number): string => {
  if (completionRate >= 80) return COMPLETION_COLORS.excellent;
  if (completionRate >= 60) return COMPLETION_COLORS.good;
  if (completionRate >= 40) return COMPLETION_COLORS.average;
  return COMPLETION_COLORS.poor;
};

const getTopicStats = (topics: TopicStats[] = []): ChartDataItem[] => {
  return topics.map((topic) => ({
    topicName: topic.topic.trim(),
    totalAttempts: topic.totalAttempts,
    stage: topic.stage,
    avgSecondsPlayed: topic.avgSecondsPlayed,
    avgHintUsed: topic.avgHintUsed,
    completionRate: topic.completionRate,
    correctness: topic.correctness,
  }));
};

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
};

const StudentStageCustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload as ChartDataItem;

    return (
      <div className="bg-background border rounded-lg shadow-lg p-3 text-xs max-w-[400px]">
        <p className="font-bold text-sm mb-1 truncate">Stage {data.stage}</p>
        <p className="text-muted-foreground mb-2 truncate text-[11px]">
          {data.topicName}
        </p>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-nowrap">Completion:</span>
              <Badge
                variant="outline"
                className={
                  data.completionRate >= 80
                    ? "text-green-600 border-green-600"
                    : data.completionRate >= 60
                      ? "text-blue-600 border-blue-600"
                      : data.completionRate >= 40
                        ? "text-amber-600 border-amber-600"
                        : "text-red-600 border-red-600"
                }
              >
                {data.completionRate}%
              </Badge>
            </div>
            <div className="flex gap-2 justify-between items-center">
              <span className="text-nowrap">Total Attempts:</span>
              <span className="font-semibold">{data.totalAttempts}</span>
            </div>
          </div>

          <div className="flex-1 border-l border-border pl-4">
            <div className="flex gap-2 justify-between items-center mb-1">
              <span className="text-amber-600 font-semibold text-nowrap">
                Hints Used:
              </span>
              <span className="text-muted-foreground text-nowrap">
                {data.avgHintUsed.toFixed(1)}
              </span>
            </div>
            <div className="flex gap-2 justify-between items-center">
              <span className="text-purple-600 font-semibold text-nowrap">
                Time Spent:
              </span>
              <span className="text-muted-foreground text-nowrap">
                {formatDuration(data.avgSecondsPlayed)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
