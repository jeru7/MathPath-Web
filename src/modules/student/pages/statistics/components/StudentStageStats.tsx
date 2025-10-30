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
      <article className="bg-white dark:bg-gray-800 shadow-sm p-6 rounded-lg flex-1 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400 mx-auto mb-2 transition-colors duration-200"></div>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
              Loading stage statistics...
            </p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="bg-white dark:bg-gray-800 p-3 rounded-sm flex flex-col justify-around h-full w-full overflow-x-hidden transition-colors duration-200">
      <header className="">
        <div className="flex flex-col gap-2">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">
              Stage
            </h3>
          </div>
        </div>
      </header>

      {chartData.length === 0 ? (
        <div className="flex h-48 items-center justify-center border border-gray-200 dark:border-gray-700 rounded-lg transition-colors duration-200">
          <div className="text-center text-gray-500 dark:text-gray-400 transition-colors duration-200">
            <div className="text-4xl mb-2">📊</div>
            <p className="italic">No stage data available</p>
          </div>
        </div>
      ) : (
        <div className="w-full h-fit overflow-x-auto overflow-y-clip">
          <div className="w-full min-w-[1200px] h-48">
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
                  stroke="#f0f0f0"
                  className="dark:stroke-gray-600"
                />
                <XAxis
                  dataKey="stage"
                  height={60}
                  interval={0}
                  tick={<CustomAxisTick />}
                  className="dark:text-gray-300"
                />
                <YAxis
                  domain={[0, 100]}
                  className="dark:text-gray-300"
                  label={{
                    value: "Completion Rate (%)",
                    angle: -90,
                    position: "insideLeft",
                    offset: -10,
                    style: {
                      textAnchor: "middle",
                      fontSize: 12,
                      fill: "#6b7280",
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
      <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 text-xs text-gray-600 dark:text-gray-400 mt-2 px-4 sm:px-2 transition-colors duration-200">
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-3 h-3 rounded bg-green-500 flex-shrink-0"></div>
          <span className="whitespace-nowrap dark:text-gray-300">
            Excellent (80-100%)
          </span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-3 h-3 rounded bg-blue-500 flex-shrink-0"></div>
          <span className="whitespace-nowrap dark:text-gray-300">
            Good (60-79%)
          </span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-3 h-3 rounded bg-amber-500 flex-shrink-0"></div>
          <span className="whitespace-nowrap dark:text-gray-300">
            Average (40-59%)
          </span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-3 h-3 rounded bg-red-500 flex-shrink-0"></div>
          <span className="whitespace-nowrap dark:text-gray-300">
            Poor (0-39%)
          </span>
        </div>
      </div>
    </article>
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
      <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 text-xs max-w-[400px] transition-colors duration-200">
        <p className="font-bold text-sm mb-1 text-gray-900 dark:text-gray-100 truncate transition-colors duration-200">
          Stage {data.stage}
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-2 truncate text-[11px] transition-colors duration-200">
          {data.topicName}
        </p>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-700 dark:text-gray-300 text-nowrap transition-colors duration-200">
                Completion:
              </span>
              <span
                className={`font-bold text-nowrap ${data.completionRate >= 80
                    ? "text-green-600 dark:text-green-400"
                    : data.completionRate >= 60
                      ? "text-blue-600 dark:text-blue-400"
                      : data.completionRate >= 40
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-red-600 dark:text-red-400"
                  } transition-colors duration-200`}
              >
                {data.completionRate}%
              </span>
            </div>
            <div className="flex gap-2 justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300 text-nowrap transition-colors duration-200">
                Total Attempts:
              </span>
              <span className="font-semibold dark:text-gray-300 transition-colors duration-200">
                {data.totalAttempts}
              </span>
            </div>
          </div>

          <div className="flex-1 border-l border-gray-200 dark:border-gray-600 pl-4 transition-colors duration-200">
            <div className="flex gap-2 justify-between items-center mb-1">
              <span className="text-amber-600 dark:text-amber-400 font-semibold text-nowrap transition-colors duration-200">
                Hints Used:
              </span>
              <span className="text-gray-600 dark:text-gray-400 text-nowrap transition-colors duration-200">
                {data.avgHintUsed.toFixed(1)}
              </span>
            </div>
            <div className="flex gap-2 justify-between items-center">
              <span className="text-purple-600 dark:text-purple-400 font-semibold text-nowrap transition-colors duration-200">
                Time Spent:
              </span>
              <span className="text-gray-600 dark:text-gray-400 text-nowrap transition-colors duration-200">
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
