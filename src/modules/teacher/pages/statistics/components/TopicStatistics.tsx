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
} from "../../../services/teacher-stats.service";
import {
  TopicCorrectness,
  TopicStats,
} from "../../../../core/types/chart.type";
import { getCustomSelectColor } from "../../../../core/styles/selectStyles";
import { CustomAxisTick } from "./CustomAxisTick";

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
      <article className="bg-white shadow-sm p-6 rounded-lg flex-1 border border-gray-200">
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading topic statistics...</p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="bg-white shadow-sm p-2 rounded-lg flex-1 flex flex-col gap-4 border border-gray-200">
      <header className="">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
          <div>
            <h3 className="text-lg font-bold">Topics</h3>
            <p className="text-sm text-gray-600 mt-1">
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
        <div className="flex h-48 items-center justify-center border border-gray-200 rounded-lg">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">📊</div>
            <p className="italic">No topic data available</p>
          </div>
        </div>
      ) : (
        <div className="w-full h-48">
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
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="stage"
                height={60}
                interval={0}
                tick={<CustomAxisTick />}
              />
              <YAxis
                domain={[0, 100]}
                label={{
                  value: "Avg. Correctness (%)",
                  angle: -90,
                  position: "insideLeft",
                  offset: -10,
                  style: { textAnchor: "middle", fontSize: 12 },
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
      )}

      <div className="flex justify-center items-center gap-6 text-xs text-gray-600 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500"></div>
          <span>Excellent (80-100%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-500"></div>
          <span>Good (60-79%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-amber-500"></div>
          <span>Average (40-59%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500"></div>
          <span>Poor (0-39%)</span>
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
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 text-sm max-w-xs">
        <p className="font-bold text-base mb-3 text-gray-900 border-b pb-2">
          {data.topicName}
        </p>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">
              Avg. Correctness:
            </span>
            <span
              className={`font-bold ${
                data.avgCorrectPercentage >= 80
                  ? "text-green-600"
                  : data.avgCorrectPercentage >= 60
                    ? "text-blue-600"
                    : data.avgCorrectPercentage >= 40
                      ? "text-amber-600"
                      : "text-red-600"
              }`}
            >
              {data.avgCorrectPercentage.toFixed(1)}%
            </span>
          </div>

          <div className="border-t pt-2">
            <p className="font-semibold text-gray-700 mb-1">By Difficulty:</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="text-green-600 font-semibold">Easy</div>
                <div className="text-gray-600">
                  {data.correctness.easy.correctPercentage}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-amber-600 font-semibold">Medium</div>
                <div className="text-gray-600">
                  {data.correctness.medium.correctPercentage}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-red-600 font-semibold">Hard</div>
                <div className="text-gray-600">
                  {data.correctness.hard.correctPercentage}%
                </div>
              </div>
            </div>
          </div>

          {/* Key metrics */}
          <div className="space-y-1 text-xs border-t pt-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Stage:</span>
              <span className="font-semibold">{data.stage}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
