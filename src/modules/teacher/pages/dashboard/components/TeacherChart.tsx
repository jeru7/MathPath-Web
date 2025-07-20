import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
  YAxis,
} from "recharts";
import { useState, useEffect, type ReactElement } from "react";
import { useParams } from "react-router-dom";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import {
  SectionTopicStats,
  TopicStats,
} from "../../../../core/types/chart.type";
import {
  useTeacherOverallTopicStats,
  useTeacherSectionTopicStats,
} from "../../../services/teacher-stats.service";

function TopicStatsCustomTooltip({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;

    return (
      <div className="bg-white flex flex-col gap-1 p-2 rounded shadow border text-sm max-w-xs">
        <p>Stage {data.stage}</p>
        <p className="italic text-[var(--primary-black)]">"{data.topic}"</p>
        <p className="text-[var(--primary-black)]">
          Total Attempts: {data.totalAttempts}
        </p>
        <p className="text-[var(--primary-black)]">
          Avg Time Spent: {data.avgMinsPlayed}
        </p>
        <p className="text-[var(--tertiary-green)]">
          Completion Rate: {data.completionRate}%
        </p>
      </div>
    );
  }

  return null;
}

function CorrectnessCustomTooltip({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;

    return (
      <div className="bg-white flex flex-col gap-1 p-2 rounded shadow border text-sm max-w-xs">
        <p>Stage {data.stage}</p>
        <p className="italic text-[var(--primary-black)]">"{data.topic}"</p>
        <p className="text-[var(--tertiary-green)]">
          Easy: {data.correctness.easy}%
        </p>
        <p className="text-[var(--primary-yellow)]">
          Medium: {data.correctness.medium}%
        </p>
        <p className="text-[var(--primary-red)]">
          Hard: {data.correctness.hard}%
        </p>
      </div>
    );
  }

  return null;
}

// normalized overall topic data per topic - pang transform lang para marender nang maayos
function getOverallChartData(data: TopicStats[] = []) {
  console.log(data);
  return data.map((topic) => ({
    stage: `${topic.stage}`,
    topic: topic.topic,
    totalAttempts: topic.totalAttempts,
    avgMinsPlayed: (topic.avgSecondsPlayed / 60).toFixed(1),
    avgHintUsed: topic.avgHintUsed,
    completionRate: topic.completionRate,
    correctness: {
      easy: topic.correctness.easy.correctPercentage,
      medium: topic.correctness.medium.correctPercentage,
      hard: topic.correctness.hard.correctPercentage,
    },
  }));
}

// normalized section topic data per topic - pang transform lang para marender nang maayos
function getSectionChartData(
  data: SectionTopicStats[] = [],
  selectedSection: string | null,
) {
  return data
    .filter((section) => section.sectionName === selectedSection)
    .flatMap((section) =>
      section.topicStats.map((topic) => ({
        stage: `${topic.stage}`,
        topic: topic.topic,
        totalAttempts: topic.totalAttempts,
        avgMinsPlayed: (topic.avgSecondsPlayed / 60).toFixed(1),
        avgHintUsed: topic.avgHintUsed,
        completionRate: topic.completionRate,
        correctness: {
          easy: topic.correctness.easy.correctPercentage,
          medium: topic.correctness.medium.correctPercentage,
          hard: topic.correctness.hard.correctPercentage,
        },
      })),
    );
}

export default function TeacherChart({
  classNames,
}: {
  classNames: string;
}): ReactElement {
  const [viewMode, setViewMode] = useState<"overall" | "by section">("overall");
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const { teacherId } = useParams();
  const { data: overallTopicStats } = useTeacherOverallTopicStats(
    teacherId || "",
  );
  const { data: sectionTopicStats = [] } = useTeacherSectionTopicStats(
    teacherId || "",
  );

  useEffect(() => {
    if (viewMode === "by section" && sectionTopicStats.length > 0) {
      setSelectedSection(sectionTopicStats[0].sectionName);
    }
  }, [viewMode, sectionTopicStats]);

  if (!teacherId) {
    return <div>no teacher id...</div>;
  }

  const chartData =
    viewMode === "overall"
      ? getOverallChartData(overallTopicStats)
      : getSectionChartData(sectionTopicStats, selectedSection);

  return (
    <section className={`flex flex-col items-center gap-8 ${classNames}`}>
      {/* Header */}
      <div className="flex w-full items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Topic Data</h2>
        <div className="flex gap-4">
          <select
            className="rounded-md border px-3 py-2"
            value={viewMode}
            onChange={(e) =>
              setViewMode(e.target.value as "overall" | "by section")
            }
          >
            <option value="overall">All</option>
            <option value="by section">By Section</option>
          </select>

          {/* show section drowpdown pag by section yung selected */}
          {viewMode === "by section" && sectionTopicStats.length > 0 && (
            <select
              className="rounded-md border px-3 py-2"
              value={selectedSection || ""}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              {sectionTopicStats.map((section) => (
                <option key={section.sectionName} value={section.sectionName}>
                  {section.sectionName}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Basic metrics chart */}
      <div className="flex h-full max-h-[400px] w-full flex-col rounded-lg bg-white p-4 shadow">
        <h3 className="mb-2 text-lg font-medium">Basic Topic Metrics</h3>
        {chartData.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-[var(--primary-gray)] italic">
            No data available.
          </div>
        ) : (
          <ResponsiveContainer className="h-full w-full">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" />
              <YAxis domain={[0, 100]} />
              <Tooltip content={<TopicStatsCustomTooltip />} />
              <Legend />
              <Bar
                dataKey="completionRate"
                fill="#99d58d"
                name="Completion Rate"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Correctness chart */}
      <div className="flex h-full max-h-[400px] w-full flex-col rounded-lg bg-white p-4 shadow">
        <h3 className="mb-2 text-lg font-medium">Correctness</h3>
        {chartData.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-[var(--primary-gray)] italic">
            No data available.
          </div>
        ) : (
          <ResponsiveContainer className="h-full w-full">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" />
              <YAxis domain={[0, 100]} />
              <Tooltip content={<CorrectnessCustomTooltip />} />
              <Legend />
              <Bar dataKey="correctness.easy" fill="#99d58d" name="Easy" />
              <Bar dataKey="correctness.medium" fill="#fbc93d" name="Medium" />
              <Bar dataKey="correctness.hard" fill="#ff8383" name="Hard" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
