import { useState, type ReactElement } from "react";
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
import { QuestionStats } from "../../../../core/types/chart.type";
import { useStudentQuestionStats } from "../../../services/student-stats.service";
import { getCustomSelectColor } from "../../../../core/styles/selectStyles";
import { CustomAxisTick } from "../../../../teacher/pages/statistics/components/CustomAxisTick";

type StudentQuestionStatsProps = {
  studentId: string;
};

export default function StudentQuestionStats({
  studentId,
}: StudentQuestionStatsProps): ReactElement {
  const [selectedStage, setSelectedStage] = useState<string>("1");

  const { data: studentQuestionStats, isLoading } =
    useStudentQuestionStats(studentId);

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
      <div
        className={`flex flex-col w-full h-full bg-white dark:bg-gray-800 rounded-sm shadow-sm p-4 transition-colors duration-200`}
      >
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 dark:border-green-400 mx-auto mb-2"></div>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
              Loading question statistics...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col h-full w-full p-3 bg-white dark:bg-gray-800 justify-around transition-colors duration-200`}
    >
      <header className="relative flex items-start">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">
          Question Stats
        </h3>
        <div className="absolute right-0 top-0">
          {stageOptions.length > 0 && (
            <Select<StageOption>
              options={stageOptions}
              styles={getCustomSelectColor<StageOption>({
                minHeight: "38px",
                padding: "0px 8px",
                menuWidth: "150px",
                menuMaxHeight: "160px",
                menuBackgroundColor: "white",
                backgroundColor: "white",
                textColor: "#1f2937",
                dark: {
                  backgroundColor: "#374151",
                  textColor: "#f9fafb",
                  borderColor: "#4b5563",
                  borderFocusColor: "#10b981",
                  optionHoverColor: "#1f2937",
                  optionSelectedColor: "#059669",
                  menuBackgroundColor: "#374151",
                  placeholderColor: "#9ca3af",
                },
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
        </div>
      </header>

      {chartData.length === 0 ? (
        <div className="flex h-48 items-center justify-center border border-gray-200 dark:border-gray-700 rounded-lg transition-colors duration-200">
          <div className="text-center text-gray-500 dark:text-gray-400 transition-colors duration-200">
            <div className="text-4xl mb-2">📊</div>
            <p className="italic">
              No question data available for Stage {selectedStage}
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full overflow-x-auto overflow-y-clip">
          <div className="w-full h-48 min-w-[800px]">
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
                  dataKey="questionNumber"
                  height={60}
                  interval={0}
                  label={{
                    position: "insideBottom",
                    offset: -10,
                    style: {
                      textAnchor: "middle",
                      fontSize: 12,
                      fill: "#6b7280",
                    },
                  }}
                  tick={<CustomAxisTick />}
                  className="dark:text-gray-300"
                />
                <YAxis
                  domain={[0, 100]}
                  className="dark:text-gray-300"
                  label={{
                    value: "Correctness (%)",
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
        </div>
      )}

      <div className="flex justify-center items-center gap-6 text-xs text-gray-600 dark:text-gray-400 transition-colors duration-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500"></div>
          <span className="dark:text-gray-300">Easy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-amber-500"></div>
          <span className="dark:text-gray-300">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500"></div>
          <span className="dark:text-gray-300">Hard</span>
        </div>
      </div>
    </div>
  );
}

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
      <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 text-xs max-w-[500px] transition-colors duration-200">
        <p className="font-bold text-sm mb-1 text-gray-900 dark:text-gray-100 truncate transition-colors duration-200">
          Stage {data.stage} - Question {data.questionNumber}
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-2 line-clamp-2 text-[11px] transition-colors duration-200">
          {data.question}
        </p>

        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-700 dark:text-gray-300 transition-colors duration-200">
                Correctness:
              </span>
              <span className="font-bold text-blue-600 dark:text-blue-400 ml-2 transition-colors duration-200">
                {data.correctnessPercentage}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300 transition-colors duration-200">
                Total Attempts:
              </span>
              <span className="font-semibold dark:text-gray-100 transition-colors duration-200">
                {data.totalAttempts}
              </span>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-1 border-l border-gray-200 dark:border-gray-600 pl-4 transition-colors duration-200">
            <div className="flex justify-between items-center gap-2">
              <span className="text-green-600 dark:text-green-400 font-semibold transition-colors duration-200">
                Correct:
              </span>
              <span className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
                {data.correctCount}
              </span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-red-600 dark:text-red-400 font-semibold transition-colors duration-200">
                Incorrect:
              </span>
              <span className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
                {data.totalAttempts - data.correctCount}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between text-[11px] border-t border-gray-200 dark:border-gray-600 pt-2 transition-colors duration-200">
          <span className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
            Difficulty:
          </span>
          <span className="font-semibold dark:text-gray-300 capitalize transition-colors duration-200">
            {data.difficulty}
          </span>
        </div>
      </div>
    );
  }

  return null;
};
