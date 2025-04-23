import { useState, type ReactElement } from "react";
import { useParams } from "react-router-dom";
import { useStudentQuestionStats } from "../../../../hooks/useStudent";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  TooltipProps,
  YAxis,
} from "recharts";
import { IQuestionStats } from "../../../../types/chart.type";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

// Normalize question stats para sa pag render sa chart 
function getQuestionStats(data: IQuestionStats[] = []) {
  return data.map((question, index) => ({
    questionNumber: `Question ${index + 1}`,
    question: question.question,
    difficulty: question.difficulty,
    totalAttempts: question.totalAttempts,
    correctCount: question.correctCount,
    gameLevel: question.gameLevel,
    correctnessPercentage: question.correctnessPercentage,
  }));
}

function QuestionCustomTooltip({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;

    return (
      <div className="bg-white p-2 rounded shadow border text-sm max-w-xs">
        {/* Question */}
        <p className="italic text-gray-600">"{data.question}"</p>
        {/* Difficulty - naka uppercase lang yung first letter */}
        <p>Difficulty: {data.difficulty.charAt(0).toUpperCase() + data.difficulty.slice(1)}</p>
        <p className="text-[var(--primary-yellow)]">Total Attempts: {data.totalAttempts}</p>
        <p className="text-[var(--primary-red)]">Wrong: {data.totalAttempts - data.correctCount}</p>
        <p className="text-[var(--tertiary-green)]">Correctness: {data.correctnessPercentage}%</p>
      </div>
    );
  }

  return null;
}

export default function StudentChart({
  classNames,
}: {
  classNames: string;
}): ReactElement {
  const { studentId } = useParams();
  const {
    data: studentQuestionStats,
    isLoading,
  } = useStudentQuestionStats(studentId || "");
  const [selectedLevel, setSelectedLevel] = useState<number>(1);

  if (isLoading) {
    return <p className={`${classNames}`}>Loading chart...</p>;
  }

  const availableLevels = [
    ...new Set(studentQuestionStats?.map((stat) => stat.gameLevel)),
  ];

  const filteredStats = studentQuestionStats?.filter(
    (stat) => stat.gameLevel === selectedLevel
  );

  const chartData = getQuestionStats(filteredStats || []);

  if (!chartData.length) {
    return <p className={`${classNames}`}>No chart data available.</p>;
  }

  return (
    <div className={`${classNames} p-8 gap-4 flex flex-col`}>
      <header className="flex justify-between">
        <h3 className="font-bold text-2xl">Question stats</h3>
        <select
          id="level-select"
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(Number(e.target.value))}
          className="border rounded p-2"
        >
          {availableLevels.map((level) => (
            <option key={level} value={level}>
              Level {level}
            </option>
          ))}
        </select>
      </header>
      {/* Question Chart */}
      <div className="w-full h-72">
        <ResponsiveContainer className="w-full h-full">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="questionNumber" />
            <YAxis domain={[0, 100]} />
            <Tooltip content={<QuestionCustomTooltip />} />
            <Legend />
            <Bar
              dataKey="correctnessPercentage"
              fill="#99d58d"
              name="Correctness"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

