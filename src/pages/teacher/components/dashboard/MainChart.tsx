import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { type ReactElement } from "react";

const topicData = [
  {
    topic: "Topic 1",
    totalAttempts: 340,
    avgTimeSpent: 48.2,
    completionRate: 0.76,
    avgHintUsed: 1.3,
    correctness: {
      easy: 0.85,
      medium: 0.67,
      hard: 0.43
    }
  },
  {
    topic: "Topic 2",
    totalAttempts: 210,
    avgTimeSpent: 51.6,
    completionRate: 0.62,
    avgHintUsed: 2.1,
    correctness: {
      easy: 0.79,
      medium: 0.54,
      hard: 0.37
    }
  },
  {
    topic: "Topic 3",
    totalAttempts: 290,
    avgTimeSpent: 45.4,
    completionRate: 0.81,
    avgHintUsed: 0.9,
    correctness: {
      easy: 0.91,
      medium: 0.73,
      hard: 0.61
    }
  },
  {
    topic: "Topic 4",
    totalAttempts: 340,
    avgTimeSpent: 48.2,
    completionRate: 0.76,
    avgHintUsed: 1.3,
    correctness: {
      easy: 0.85,
      medium: 0.67,
      hard: 0.43
    }
  },
  {
    topic: "Topic 5",
    totalAttempts: 210,
    avgTimeSpent: 51.6,
    completionRate: 0.62,
    avgHintUsed: 2.1,
    correctness: {
      easy: 0.79,
      medium: 0.54,
      hard: 0.37
    }
  },
  {
    topic: "Topic 6",
    totalAttempts: 290,
    avgTimeSpent: 45.4,
    completionRate: 0.81,
    avgHintUsed: 0.9,
    correctness: {
      easy: 0.91,
      medium: 0.73,
      hard: 0.61
    }
  },
  {
    topic: "Topic 7",
    totalAttempts: 340,
    avgTimeSpent: 48.2,
    completionRate: 0.76,
    avgHintUsed: 1.3,
    correctness: {
      easy: 0.85,
      medium: 0.67,
      hard: 0.43
    }
  },
  {
    topic: "Topic 8",
    totalAttempts: 210,
    avgTimeSpent: 51.6,
    completionRate: 0.62,
    avgHintUsed: 2.1,
    correctness: {
      easy: 0.79,
      medium: 0.54,
      hard: 0.37
    }
  },
  {
    topic: "Topic 9",
    totalAttempts: 290,
    avgTimeSpent: 45.4,
    completionRate: 0.81,
    avgHintUsed: 0.9,
    correctness: {
      easy: 0.91,
      medium: 0.73,
      hard: 0.61
    }
  },
  {
    topic: "Topic 10",
    totalAttempts: 340,
    avgTimeSpent: 48.2,
    completionRate: 0.76,
    avgHintUsed: 1.3,
    correctness: {
      easy: 0.85,
      medium: 0.67,
      hard: 0.43
    }
  },
  {
    topic: "Topic 11",
    totalAttempts: 210,
    avgTimeSpent: 51.6,
    completionRate: 0.62,
    avgHintUsed: 2.1,
    correctness: {
      easy: 0.79,
      medium: 0.54,
      hard: 0.37
    }
  },
  {
    topic: "Topic 12",
    totalAttempts: 290,
    avgTimeSpent: 45.4,
    completionRate: 0.81,
    avgHintUsed: 0.9,
    correctness: {
      easy: 0.91,
      medium: 0.73,
      hard: 0.61
    }
  },
];

export default function MainChart({ classNames }: { classNames: string }): ReactElement {
  const chartData = topicData.map((topic) => ({
    name: topic.topic,
    Attempts: topic.totalAttempts,
    "Avg Time Spent": topic.avgTimeSpent,
    "Completion Rate": topic.completionRate * 100, // optional: convert to percentage
    "Hints Used": topic.avgHintUsed,
  }));

  const correctnessChartData = topicData.map((topic) => ({
    name: topic.topic,
    Easy: topic.correctness.easy * 100,
    Medium: topic.correctness.medium * 100,
    Hard: topic.correctness.hard * 100,
  }));

  return (
    <section className={`flex flex-col items-center gap-8 ${classNames}`}>
      {/* stacked bar chart */}
      <div className="flex h-full max-h-[800px] w-full flex-col rounded-lg bg-inherit p-4">
        <h2 className="mb-4 text-xl font-semibold">Topic Data</h2>
        <ResponsiveContainer className="h-full max-h-[800px] w-full">
          <BarChart data={correctnessChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `${value}`} />
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend />
            <Bar dataKey="Easy" stackId="a" fill="#a0e0a9" />
            <Bar dataKey="Medium" stackId="a" fill="#f0c929" />
            <Bar dataKey="Hard" stackId="a" fill="#f87171" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

