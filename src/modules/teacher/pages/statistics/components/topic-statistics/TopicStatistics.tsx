import { useState, type ReactElement } from "react";
import { useParams } from "react-router-dom";
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
import Select from "react-select";
import {
  useTeacherOverallTopicStats,
  useTeacherSectionTopicStats,
} from "../../../../services/teacher-stats.service";
import {
  TopicCorrectness,
  TopicStats,
} from "../../../../../core/types/chart.type";
import { getCustomSelectColor } from "../../../../../core/styles/selectStyles";
import { CustomAxisTick } from "./../CustomAxisTick";

export default function TopicStatistics(): ReactElement {
  const { teacherId } = useParams();
  const [selectedSection, setSelectedSection] = useState<string>("all");

  const { data: overallTopicStats, isLoading: isLoadingOverall } =
    useTeacherOverallTopicStats(teacherId || "");
  const { data: sectionTopicStats, isLoading: isLoadingSections } =
    useTeacherSectionTopicStats(teacherId || "");

  const isLoading = isLoadingOverall || isLoadingSections;

  const sectionOptions: Section[] = [
    { id: "all", name: "Overall" },
    ...(sectionTopicStats?.map((sectionStat) => ({
      id: sectionStat.sectionId,
      name: sectionStat.sectionName,
    })) || []),
  ];

  const getFilteredData = (): TopicStats[] => {
    if (selectedSection === "all") {
      return overallTopicStats || [];
    } else {
      const sectionData = sectionTopicStats?.find(
        (section) => section.sectionId === selectedSection,
      );
      return sectionData?.topicStats || [];
    }
  };

  const filteredData = getFilteredData();
  const chartData = getTopicStats(filteredData);

  if (isLoading) {
    return (
      <article className="bg-white dark:bg-gray-800 shadow-sm p-6 rounded-sm flex-1 transition-colors duration-200">
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400 mx-auto mb-2"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading topic statistics...
            </p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="bg-white dark:bg-gray-800 shadow-sm p-2 rounded-sm flex-1 flex flex-col gap-4 border border-white dark:border-gray-700 transition-colors duration-200">
      <header className="text-gray-900 dark:text-gray-100">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
          <div>
            <h3 className="text-lg font-semibold dark:text-gray-200">Topics</h3>
            <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mt-1">
              Student answer correctness rates across stages
            </p>
          </div>

          <Select<Section>
            id="section"
            name="section"
            options={sectionOptions}
            getOptionLabel={(option: Section) => option.name}
            getOptionValue={(option: Section) => option.id}
            styles={getCustomSelectColor<Section>({
              minHeight: "38px",
              padding: "0px 8px",
              menuWidth: "200px",
              menuBackgroundColor: "white",
              dark: {
                menuBackgroundColor: "#374151",
                backgroundColor: "#374151",
                textColor: "#f9fafb",
                borderColor: "#4b5563",
                borderFocusColor: "#10b981",
                optionHoverColor: "#1f2937",
                optionSelectedColor: "#059669",
                placeholderColor: "#9ca3af",
              },
            })}
            className="basic-select min-w-[200px]"
            classNamePrefix="select"
            placeholder="Select section..."
            onChange={(selected) => setSelectedSection(selected?.id || "all")}
            value={
              sectionOptions.find(
                (section) => section.id === selectedSection,
              ) || null
            }
          />
        </div>
      </header>

      {chartData.length === 0 ? (
        <div className="flex h-48 items-center justify-center border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-2">📊</div>
            <p className="italic">No topic data available</p>
          </div>
        </div>
      ) : (
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
                    value: "Avg. Correctness (%)",
                    angle: -90,
                    position: "insideLeft",
                    offset: -10,
                    style: {
                      textAnchor: "middle",
                      fontSize: 12,
                      fill: "#6b7280", // gray-500 for light mode
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
      )}

      <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 text-xs text-gray-600 dark:text-gray-400 mt-4 px-4 sm:px-2 transition-colors duration-200">
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

interface Section {
  id: string;
  name: string;
}

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

const getTopicStats = (topics: TopicStats[] = []): ChartDataItem[] => {
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
};

const getBarColor = (correctness: number): string => {
  if (correctness >= 80) return CORRECTNESS_COLORS.excellent;
  if (correctness >= 60) return CORRECTNESS_COLORS.good;
  if (correctness >= 40) return CORRECTNESS_COLORS.average;
  return CORRECTNESS_COLORS.poor;
};

const TopicCustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload as ChartDataItem;

    return (
      <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-xs max-w-[400px] transition-colors duration-200">
        <p className="font-bold text-sm mb-2 text-gray-900 dark:text-white text-nowrap truncate">
          {data.topicName}
        </p>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Avg Correct:
            </span>
            <span
              className={`font-bold ${data.avgCorrectPercentage >= 80
                  ? "text-green-600 dark:text-green-400"
                  : data.avgCorrectPercentage >= 60
                    ? "text-blue-600 dark:text-blue-400"
                    : data.avgCorrectPercentage >= 40
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-red-600 dark:text-red-400"
                }`}
            >
              {data.avgCorrectPercentage.toFixed(1)}%
            </span>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-600 pt-1.5">
            <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1 text-[11px]">
              By Difficulty:
            </p>
            <div className="grid grid-cols-3 gap-1 text-[10px]">
              <div className="text-center">
                <div className="text-green-600 dark:text-green-400 font-semibold">
                  Easy
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {data.correctness.easy.correctPercentage}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-amber-600 dark:text-amber-400 font-semibold">
                  Med
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {data.correctness.medium.correctPercentage}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-red-600 dark:text-red-400 font-semibold">
                  Hard
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {data.correctness.hard.correctPercentage}%
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between text-[11px] border-t border-gray-200 dark:border-gray-600 pt-1.5">
            <span className="text-gray-600 dark:text-gray-400">Stage:</span>
            <span className="font-semibold dark:text-gray-300">
              {data.stage}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
