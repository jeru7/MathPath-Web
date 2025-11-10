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
import { QuestionStats } from "../../../../core/types/chart.type";
import { useStudentQuestionStats } from "../../../services/student-stats.service";
import { CustomAxisTick } from "../../../../teacher/pages/statistics/components/CustomAxisTick";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

type StudentQuestionStatsProps = {
  studentId: string;
};

// Skeleton component
function StudentQuestionStatsSkeleton(): ReactElement {
  return (
    <Card className="flex flex-col h-full w-full">
      <CardHeader className="p-3 sm:p-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:justify-between lg:items-center">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-[150px]" />
        </div>
      </CardHeader>
      <CardContent className="p-3 flex flex-col justify-around flex-1">
        <Skeleton className="h-48 w-full" />
        <div className="flex justify-center items-center gap-6">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

// Memoized tooltip component
function QuestionCustomTooltip({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload as ChartDataItem;

    return (
      <div className="bg-background border rounded-lg shadow-lg p-3 text-xs max-w-[500px]">
        <p className="font-bold text-sm mb-1 truncate">
          Stage {data.stage} - Question {data.questionNumber}
        </p>
        <p className="text-muted-foreground mb-2 line-clamp-2 text-[11px]">
          {data.question}
        </p>

        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span>Correctness:</span>
              <Badge
                variant="outline"
                className="text-blue-600 border-blue-600 ml-2"
              >
                {data.correctnessPercentage}%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Total Attempts:</span>
              <span className="font-semibold">{data.totalAttempts}</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-1 border-l border-border pl-4">
            <div className="flex justify-between items-center gap-2">
              <span className="text-green-600 font-semibold">Correct:</span>
              <span className="text-muted-foreground">{data.correctCount}</span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-red-600 font-semibold">Incorrect:</span>
              <span className="text-muted-foreground">
                {data.totalAttempts - data.correctCount}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between text-[11px] border-t border-border pt-2">
          <span className="text-muted-foreground">Difficulty:</span>
          <Badge variant="outline" className="font-semibold capitalize">
            {data.difficulty}
          </Badge>
        </div>
      </div>
    );
  }

  return null;
}

// Memoized chart component
function QuestionChart({ chartData }: { chartData: ChartDataItem[] }) {
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

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px] h-48">
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
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
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
                  fill: "hsl(var(--muted-foreground))",
                },
              }}
              tick={<CustomAxisTick />}
              className="fill-muted-foreground"
            />
            <YAxis
              domain={[0, 100]}
              className="fill-muted-foreground"
              label={{
                value: "Correctness (%)",
                angle: -90,
                position: "insideLeft",
                offset: -10,
                style: {
                  textAnchor: "middle",
                  fontSize: 12,
                  fill: "hsl(var(--muted-foreground))",
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
  );
}

function EmptyState() {
  return (
    <div className="flex h-48 items-center justify-center border border-dashed rounded-lg">
      <div className="text-center text-muted-foreground">
        <p className="italic">No question data available</p>
      </div>
    </div>
  );
}

function DifficultyLegend() {
  return (
    <div className="flex justify-center items-center gap-6 text-xs text-muted-foreground">
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
  );
}

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
    return <StudentQuestionStatsSkeleton />;
  }

  return (
    <Card className="flex flex-col h-full w-full">
      <CardHeader className="p-3 sm:p-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:justify-between lg:items-center">
          <div>
            <CardTitle className="text-base sm:text-lg font-semibold">
              Question Stats
            </CardTitle>
          </div>
          {uniqueStages.length > 0 && (
            <Select value={selectedStage} onValueChange={setSelectedStage}>
              <SelectTrigger className="w-[120px] sm:w-[150px]">
                <SelectValue placeholder="Select stage..." />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] overflow-y-auto">
                {uniqueStages.map((stage) => (
                  <SelectItem key={stage} value={stage.toString()}>
                    Stage {stage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-3 flex flex-col justify-around flex-1">
        {chartData.length === 0 ? (
          <EmptyState />
        ) : (
          <QuestionChart chartData={chartData} />
        )}
        <DifficultyLegend />
      </CardContent>
    </Card>
  );
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
