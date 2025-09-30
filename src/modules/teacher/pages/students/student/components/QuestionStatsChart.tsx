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
import { QuestionStats } from "../../../../../core/types/chart.type";
import { useStudentQuestionStats } from "../../../../../student/services/student-stats.service";
import { getCustomSelectColor } from "../../../../../core/styles/selectStyles";
import { CustomAxisTick } from "../../../statistics/components/CustomAxisTick";

interface StageOption {
  value: string;
  label: string;
}

interface ChartDataItem {
  question: string;
  difficulty: "easy" | "medium" | "hard";
  stage: number;
  totalAttempts: number;
  correctCount: number;
  correctnessPercentage: number;
  questionNumber: number;
}

const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case "easy":
      return "#22c55e";
    case "medium":
      return "#f59e0b";
    case "hard":
      return "#ef4444";
    default:
      return "#6b7280";
  }
};

const QuestionCustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload as ChartDataItem;

    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 text-sm max-w-xs">
        <p className="font-bold text-base mb-2 text-gray-900 border-b pb-2">
          Stage {data.stage} - Question {data.questionNumber}
        </p>
        <p className="font-semibold text-gray-700 mb-3">"{data.question}"</p>
        <p className="text-sm text-gray-600 mb-3 capitalize">
          {data.difficulty} Difficulty
        </p>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Correctness:</span>
            <span className="font-semibold text-blue-600">
              {data.correctnessPercentage}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Attempts:</span>
            <span className="font-semibold text-gray-700">
              {data.totalAttempts}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Correct Answers:</span>
            <span className="font-semibold text-green-600">
              {data.correctCount}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Incorrect Answers:</span>
            <span className="font-semibold text-red-600">
              {data.totalAttempts - data.correctCount}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default function StudentQuestionStatsChart({
  classNames,
}: {
  classNames: string;
}): ReactElement {
  const { studentId } = useParams();
  const [selectedStage, setSelectedStage] = useState<string>("1");

  const { data: studentQuestionStats, isLoading } = useStudentQuestionStats(
    studentId || "",
  );

  const getFilteredData = (): QuestionStats[] => {
    return studentQuestionStats || [];
  };

  const filteredData = getFilteredData();

  const uniqueStages = Array.from(
    new Set(filteredData.map((item) => item.stage)),
  ).sort((a, b) => a - b);

  const stageOptions: StageOption[] = uniqueStages.map((stage) => ({
    value: stage.toString(),
    label: `Stage ${stage}`,
  }));

  const getStageFilteredData = (): ChartDataItem[] => {
    const stageData = filteredData.filter(
      (item) => item.stage === parseInt(selectedStage),
    );

    return stageData.map((item, index) => ({
      question: item.question,
      difficulty: item.difficulty,
      stage: item.stage,
      totalAttempts: item.totalAttempts,
      correctCount: item.correctCount,
      correctnessPercentage: item.correctnessPercentage,
      questionNumber: index + 1,
    }));
  };

  const chartData = getStageFilteredData();

  if (isLoading) {
    return (
      <div className={`${classNames} p-4`}>
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading question statistics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${classNames} p-4 gap-4 flex flex-col`}>
      <header className="flex justify-between items-center">
        <h3 className="font-bold text-xl xl:text-2xl">Question Stats</h3>
        {stageOptions.length > 0 && (
          <Select<StageOption>
            options={stageOptions}
            styles={getCustomSelectColor<StageOption>({
              minHeight: "38px",
              padding: "0px 8px",
              menuWidth: "150px",
              menuBackgroundColor: "white",
            })}
            className="basic-select min-w-[150px]"
            classNamePrefix="select"
            placeholder="Select stage..."
            value={
              stageOptions.find((option) => option.value === selectedStage) ||
              stageOptions[0] ||
              null
            }
            onChange={(selected) => setSelectedStage(selected?.value || "1")}
          />
        )}
      </header>

      {chartData.length === 0 ? (
        <div className="flex h-48 items-center justify-center border border-gray-200 rounded-lg">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">📊</div>
            <p className="italic">
              No question data available for Stage {selectedStage}
            </p>
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
                dataKey="questionNumber"
                height={60}
                interval={0}
                label={{
                  position: "insideBottom",
                  offset: -10,
                  style: { textAnchor: "middle", fontSize: 12 },
                }}
                tick={<CustomAxisTick />}
              />
              <YAxis
                domain={[0, 100]}
                label={{
                  value: "Correctness (%)",
                  angle: -90,
                  position: "insideLeft",
                  offset: -10,
                  style: { textAnchor: "middle", fontSize: 12 },
                }}
              />
              <Tooltip content={<QuestionCustomTooltip />} />
              <Bar
                dataKey="correctnessPercentage"
                name="Correctness (%)"
                radius={[4, 4, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getDifficultyColor(entry.difficulty)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="flex justify-center items-center gap-6 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500"></div>
          <span>Easy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-amber-500"></div>
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500"></div>
          <span>Hard</span>
        </div>
      </div>
    </div>
  );
}
