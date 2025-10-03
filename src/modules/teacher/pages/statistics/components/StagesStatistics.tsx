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

export default function StagesStatistics(): ReactElement {
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
            <p className="text-gray-600">Loading stage statistics...</p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="bg-white shadow-sm p-2 rounded-lg h-fit flex flex-col gap-4 border border-gray-200 overflow-x-hidden">
      <header className="">
        <div className="flex flex-col gap-2 lg:flex-row lg:justify-between lg:items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Stages</h3>
            <p className="text-xs lg:text-sm text-gray-600 mt-1">
              Student completion rates across stages
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
            <p className="italic">No stage data available</p>
          </div>
        </div>
      ) : (
        // parent: must have static width
        <div className="w-full h-fit overflow-x-auto xl:overflow-x-hidden overflow-y-hidden">
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
                    value: "Completion Rate (%)",
                    angle: -90,
                    position: "insideLeft",
                    offset: -10,
                    style: { textAnchor: "middle", fontSize: 12 },
                  }}
                />
                <Tooltip content={<StageCustomTooltip />} />
                <Bar
                  dataKey="completionRate"
                  name="Completion Rate (%)"
                  radius={[4, 4, 0, 0]}
                  fill="#3b82f6"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </article>
  );
}

interface Section {
  id: string;
  name: string;
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

const StageCustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload as ChartDataItem;

    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 text-xs max-w-[400px]">
        <p className="font-bold text-sm mb-1 text-gray-900 truncate">
          Stage {data.stage}
        </p>
        <p className="text-gray-700 mb-2 truncate text-[11px]">
          {data.topicName}
        </p>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-700 text-nowrap">Completion:</span>
              <span className="font-bold text-blue-600 text-nowrap">
                {data.completionRate}%
              </span>
            </div>
            <div className="flex gap-2 justify-between items-center">
              <span className="text-gray-700 text-nowrap">Total Attempts:</span>
              <span className="font-semibold">{data.totalAttempts}</span>
            </div>
          </div>

          <div className="flex-1 border-l pl-4">
            <div className="flex gap-2 justify-between items-center mb-1">
              <span className="text-amber-600 font-semibold text-nowrap">
                Avg Hints:
              </span>
              <span className="text-gray-600 text-nowrap">
                {data.avgHintUsed.toFixed(1)}
              </span>
            </div>
            <div className="flex gap-2 justify-between items-center">
              <span className="text-purple-600 font-semibold text-nowrap">
                Avg Time:
              </span>
              <span className="text-gray-600 text-nowrap">
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
