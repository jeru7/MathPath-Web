import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useState, useEffect, type ReactElement } from "react";
import { useTeacherOverallTopicStats, useTeacherSectionTopicStats } from '../../../../hooks/useTeacherData';
import { ITopicStats, ISectionTopicStats } from '../../../../types/chart.type';
import { useParams } from 'react-router-dom';

// normalized overall topic data per topic - pang transform lang for easy access
function getOverallChartData(data: ITopicStats[] = []) {
  return data.map((topic) => ({
    name: `Level ${topic.level}`,
    topic: topic.topic,
    totalAttempts: topic.totalAttempts,
    avgTimeSpent: topic.avgTimeSpent,
    avgHintUsed: topic.avgHintUsed,
    completionRate: topic.completionRate,
    correctness: {
      Easy: topic.correctness.easy.correctPercentage,
      Medium: topic.correctness.medium.correctPercentage,
      Hard: topic.correctness.hard.correctPercentage,
    },
  }));
}

// normalized section topic data per topic - pang transform lang for easy access
function getSectionChartData(data: ISectionTopicStats[] = [], selectedSection: string | null) {
  return data
    .filter((section) => section.sectionName === selectedSection)
    .flatMap((section) =>
      section.topicStats.map((topic) => ({
        name: `Level ${topic.level}`,
        topic: topic.topic,
        totalAttempts: topic.totalAttempts,
        avgTimeSpent: topic.avgTimeSpent,
        avgHintUsed: topic.avgHintUsed,
        completionRate: topic.completionRate,
        correctness: {
          Easy: topic.correctness.easy.correctPercentage,
          Medium: topic.correctness.medium.correctPercentage,
          Hard: topic.correctness.hard.correctPercentage,
        },
      }))
    );
}

export default function TeacherChart({ classNames }: { classNames: string }): ReactElement {
  const [viewMode, setViewMode] = useState<"overall" | "by section">("overall");
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const { teacherId } = useParams();
  const { data: overallTopicStats } = useTeacherOverallTopicStats(teacherId || "");
  const { data: sectionTopicStats = [] } = useTeacherSectionTopicStats(teacherId || "");

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
            onChange={(e) => setViewMode(e.target.value as "overall" | "by section")}
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
      <div className="flex h-full max-h-[400px] w-full flex-col rounded-lg bg-inherit p-4 shadow">
        <h3 className="mb-2 text-lg font-medium">Basic Topic Metrics</h3>
        <ResponsiveContainer className="h-full w-full">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <Tooltip
              labelFormatter={(label) => `Topic: ${chartData.find(item => item.name === label)?.topic}`}
            />
            <Legend />
            <Bar dataKey="totalAttempts" fill="#60a5fa" name="Total Attempts" />
            <Bar dataKey="avgTimeSpent" fill="#34d399" name="Avg Time Spent" />
            <Bar dataKey="avgHintUsed" fill="#fbbf24" name="Avg Hints Used" />
            <Bar dataKey="completionRate" fill="#c084fc" name="Completion Rate" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Correctness chart */}
      <div className="flex h-full max-h-[400px] w-full flex-col rounded-lg bg-inherit p-4 shadow">
        <h3 className="mb-2 text-lg font-medium">Correctness</h3>
        <ResponsiveContainer className="h-full w-full">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <Tooltip
              formatter={(value: number) => `${value.toFixed(1)}%`}
              labelFormatter={(label) => `Topic: ${chartData.find(item => item.name === label)?.topic}`}
            />
            <Legend />
            <Bar dataKey="correctness.Easy" stackId="a" fill="#a0e0a9" name="Easy" />
            <Bar dataKey="correctness.Medium" stackId="a" fill="#f0c929" name="Medium" />
            <Bar dataKey="correctness.Hard" stackId="a" fill="#f87171" name="Hard" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
