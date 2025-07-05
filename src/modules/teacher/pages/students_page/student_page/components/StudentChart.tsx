import { useState, type ReactElement } from "react";
import { useParams } from "react-router-dom";
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
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { QuestionStats } from "../../../../../core/types/chart.types";
import { useStudentQuestionStats } from "../../../../../student/hooks/useStudentStats";

// Normalize question stats para sa pag render sa chart
const getQuestionStats = (questions: QuestionStats[] = []) => {
  return questions.map((question, index) => ({
    questionNumber: `Question ${index + 1}`,
    question: question.question,
    difficulty: question.difficulty,
    totalAttempts: question.totalAttempts,
    correctCount: question.correctCount,
    wrongCount:
      question.totalAttempts > 0
        ? question.totalAttempts - question.correctCount
        : 0,
    stage: question.stage,
    correctnessPercentage: question.correctnessPercentage,
  }));
};

// custom tooltip
const QuestionCustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;

    return (
      <div className="bg-white p-2 rounded shadow border text-sm max-w-xs">
        {/* Question */}
        <p className="italic text-gray-600">"{data.question}"</p>
        {/* Difficulty - naka uppercase lang yung first letter */}
        <p>
          Difficulty:{" "}
          {data.difficulty.charAt(0).toUpperCase() + data.difficulty.slice(1)}
        </p>
        <p className="text-[var(--primary-yellow)]">
          Total Attempts: {data.totalAttempts}
        </p>
        <p className="text-[var(--primary-red)]">
          Wrong: {data.totalAttempts - data.correctCount}
        </p>
        <p className="text-[var(--tertiary-green)]">
          Correct: {data.correctCount}
        </p>
        <p className="text-[var(--primary-green)]">
          Correct Percentage: {data.correctnessPercentage}%
        </p>
      </div>
    );
  }

  return null;
};

export default function StudentChart({
  classNames,
}: {
  classNames: string;
}): ReactElement {
  const { studentId } = useParams();
  const { data: studentQuestionStats, isLoading } = useStudentQuestionStats(
    studentId || "",
  );
  const [selectedStage, setSelectedStage] = useState<number>(1);

  if (isLoading) {
    return <p className={`${classNames}`}>Loading chart...</p>;
  }

  const availableStage = [
    ...new Set(studentQuestionStats?.map((stat) => stat.stage)),
  ];

  const filteredStats = studentQuestionStats?.filter(
    (stat) => stat.stage === selectedStage,
  );

  const chartData = getQuestionStats(filteredStats || []);

  console.log("chart data: ", chartData);

  if (chartData.length === 0) {
    return <p className={`${classNames}`}>No chart data available.</p>;
  }

  return (
    <div className={`${classNames} p-8 gap-4 flex flex-col`}>
      <header className="flex justify-between">
        <h3 className="font-bold text-2xl">Question stats</h3>
        <select
          id="level-select"
          value={selectedStage}
          onChange={(e) => setSelectedStage(Number(e.target.value))}
          className="border rounded p-2"
        >
          {availableStage.map((stage) => (
            <option key={stage} value={stage}>
              Stage {stage}
            </option>
          ))}
        </select>
      </header>
      {/* Question Chart */}
      {chartData.length === 0 ||
      chartData.every(
        (item) => item.correctCount === 0 && item.wrongCount === 0,
      ) ? (
        <div className="flex h-72 items-center justify-center italic text-[var(--primary-gray)]">
          No data available
        </div>
      ) : (
        <div className="w-full h-72">
          <ResponsiveContainer className="w-full h-full">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="questionNumber" />
              <Tooltip content={<QuestionCustomTooltip />} />
              <Legend />
              <YAxis domain={[0, "dataMax"]} />
              <Bar
                dataKey="correctCount"
                fill="#99d58d"
                stackId="a"
                name="Correct"
              />
              <Bar
                dataKey="wrongCount"
                fill="#FF8383"
                stackId="a"
                name="Wrong"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
