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
  useTeacherOverallQuestionStats,
  useTeacherSectionQuestionStats,
} from "../../../services/teacher-stats.service";
import { getCustomSelectColor } from "../../../../core/styles/selectStyles";
import { CustomAxisTick } from "./CustomAxisTick";
import { QuestionStat } from "../../../../core/types/chart.type";

export default function QuestionStatistics(): ReactElement {
  const { teacherId } = useParams();
  const [selectedSection, setSelectedSection] = useState<string>("overall");
  const [selectedStage, setSelectedStage] = useState<string>("1");

  const { data: overallQuestionStats, isLoading: isLoadingOverall } =
    useTeacherOverallQuestionStats(teacherId || "");
  const { data: sectionQuestionStats, isLoading: isLoadingSections } =
    useTeacherSectionQuestionStats(teacherId || "");

  const isLoading = isLoadingOverall || isLoadingSections;

  const sectionOptions: Section[] = [
    { id: "overall", name: "Overall" },
    ...(sectionQuestionStats?.map((sectionStat) => ({
      id: sectionStat.sectionId,
      name: sectionStat.sectionName,
    })) || []),
  ];

  const getFilteredData = (): QuestionStat[] => {
    if (selectedSection === "overall") {
      return overallQuestionStats || [];
    } else {
      const sectionData = sectionQuestionStats?.find(
        (section) => section.sectionId === selectedSection,
      );
      return sectionData?.questionStats || [];
    }
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
      ...item,
      questionNumber: index + 1,
    }));
  };

  const chartData = getStageFilteredData();

  if (isLoading) {
    return (
      <article className="bg-white shadow-sm p-6 rounded-sm flex-1">
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading question statistics...</p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="bg-white p-3 flex-1 flex flex-col gap-4 border border-gray-200">
      <header className="">
        <div className="flex flex-col gap-2 lg:flex-row lg:justify-between lg:items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Questions</h3>
            <p className="text-xs lg:text-sm text-gray-600 mt-1">
              Student correctness across questions
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-3">
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

            <Select<Section>
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
              value={
                sectionOptions.find(
                  (option) => option.id === selectedSection,
                ) || null
              }
              onChange={(selected) =>
                setSelectedSection(selected?.id || "overall")
              }
            />
          </div>
        </div>
      </header>

      {chartData.length === 0 ? (
        <div className="flex h-48 items-center justify-center border border-gray-200 rounded-lg">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">📊</div>
            <p className="italic">No question data available for Stage</p>
          </div>
        </div>
      ) : (
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
    </article>
  );
}

interface Section {
  id: string;
  name: string;
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
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 text-xs max-w-[500px]">
        <p className="font-bold text-sm mb-1 text-gray-900 truncate">
          Stage {data.stage} - Question {data.questionNumber}
        </p>
        <p className="text-gray-700 mb-2 line-clamp-2 text-[11px]">
          {data.question}
        </p>

        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-700">Correctness:</span>
              <span className="font-bold text-blue-600 ml-2">
                {data.correctnessPercentage}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Total Attempts:</span>
              <span className="font-semibold">{data.totalAttempts}</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-1 border-l pl-4">
            <div className="flex justify-between items-center gap-2">
              <span className="text-green-600 font-semibold">Correct:</span>
              <span className="text-gray-600">{data.correctCount}</span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-red-600 font-semibold">Incorrect:</span>
              <span className="text-gray-600">
                {data.totalAttempts - data.correctCount}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between text-[11px] border-t pt-2">
          <span className="text-gray-600">Difficulty:</span>
          <span className="font-semibold capitalize">{data.difficulty}</span>
        </div>
      </div>
    );
  }

  return null;
};
