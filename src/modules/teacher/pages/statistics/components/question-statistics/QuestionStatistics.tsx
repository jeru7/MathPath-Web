import { useState, type ReactElement } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  TooltipProps,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { CustomAxisTick } from "./../CustomAxisTick";
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
import { useTeacherQuestionStats } from "@/modules/teacher/services/teacher-stats.service";
import { useAdminQuestionStats } from "@/modules/admin/services/admin-stats.service";

interface ChartDataItem {
  question: string;
  difficulty: "easy" | "medium" | "hard";
  stage: number;
  totalAttempts: number;
  correctCount: number;
  correctnessPercentage: number;
  questionNumber: number;
}

function QuestionStatisticsSkeleton(): ReactElement {
  return (
    <Card className="flex-1 flex flex-col overflow-hidden">
      <CardHeader className="p-3">
        <div className="flex flex-col gap-2 lg:flex-row lg:justify-between lg:items-center">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex flex-col lg:flex-row gap-3">
            <Skeleton className="h-10 w-[150px]" />
            <Skeleton className="h-10 w-[200px]" />
          </div>
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

function QuestionCustomTooltip({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) {
  if (!active || !payload || payload.length === 0) return null;
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

function QuestionChart({ chartData }: { chartData: ChartDataItem[] }) {
  const getDifficultyColor = (difficulty: string) => {
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
    <div className="w-full h-fit overflow-x-auto xl:overflow-x-hidden overflow-y-hidden">
      <div className="w-full min-w-[1200px] xl:min-w-min h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: -20 }}
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
        <div className="text-4xl mb-2">📊</div>
        <p className="italic">No question data available for Stage</p>
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

type QuestionStatisticsProps = {
  userType: "admin" | "teacher";
  userId: string;
};

export default function QuestionStatistics({
  userType,
  userId,
}: QuestionStatisticsProps): ReactElement {
  const useQuestionStats =
    userType === "teacher" ? useTeacherQuestionStats : useAdminQuestionStats;

  const { data: questionStats, isLoading } = useQuestionStats(userId);

  const [selectedSection, setSelectedSection] = useState<string>("overall");
  const [selectedStage, setSelectedStage] = useState<string>("1");

  const overallQuestionStats = questionStats?.overall;
  const sectionQuestionStats = questionStats?.sections;

  const sectionOptions = [
    { id: "overall", name: "Overall" },
    ...(sectionQuestionStats?.map((sectionStat) => ({
      id: sectionStat.sectionId,
      name: sectionStat.sectionName,
    })) || []),
  ];

  const filteredData =
    selectedSection === "overall"
      ? overallQuestionStats || []
      : sectionQuestionStats?.find((s) => s.sectionId === selectedSection)
        ?.questionStats || [];

  const uniqueStages = Array.from(
    new Set(filteredData.map((item) => item.stage)),
  ).sort((a, b) => a - b);

  const chartData = filteredData
    .filter((item) => item.stage === parseInt(selectedStage))
    .map((item, index) => ({ ...item, questionNumber: index + 1 }));

  if (isLoading) return <QuestionStatisticsSkeleton />;

  return (
    <Card className="flex-1 flex flex-col overflow-hidden">
      <CardHeader className="p-3">
        <div className="flex flex-col gap-2 lg:flex-row lg:justify-between lg:items-center">
          <div>
            <CardTitle className="text-lg font-semibold">Questions</CardTitle>
            <p className="text-xs lg:text-sm text-muted-foreground mt-1">
              Student correctness across questions
            </p>
          </div>
          <div className="flex flex-col lg:flex-row gap-3">
            <Select value={selectedStage} onValueChange={setSelectedStage}>
              <SelectTrigger className="w-[150px]">
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
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select section..." />
              </SelectTrigger>
              <SelectContent>
                {sectionOptions.map((section) => (
                  <SelectItem key={section.id} value={section.id}>
                    {section.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
