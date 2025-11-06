import { type ReactElement } from "react";
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
import { useStudentContext } from "../../../contexts/student.context";
import { AssessmentAttempt } from "../../../../core/types/assessment-attempt/assessment-attempt.type";
import { useAssessmentsAttempts } from "../../../services/student-assessment-attempt.service";
import { useStudentAssessments } from "../../../services/student-assessment.service";
import { Assessment } from "../../../../core/types/assessment/assessment.type";
import { CustomAxisTick } from "../../../../teacher/pages/statistics/components/CustomAxisTick";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function StudentAssessmentStats(): ReactElement {
  const { studentId } = useStudentContext();
  const { data: assessments, isLoading: assessmentsLoading } =
    useStudentAssessments(studentId);
  const { data: attempts, isLoading: attemptsLoading } =
    useAssessmentsAttempts(studentId);

  const isLoading = assessmentsLoading || attemptsLoading;

  const chartData = getAssessmentStats(assessments || [], attempts || []);

  if (isLoading) {
    return (
      <Card className="flex-1">
        <CardContent className="flex items-center justify-center h-48 p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">
              Loading assessment statistics...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full w-full">
      <CardHeader className="p-3">
        <CardTitle className="text-lg font-semibold">Assessments</CardTitle>
      </CardHeader>
      <CardContent className="p-3 flex flex-col justify-around flex-1">
        {chartData.length === 0 ? (
          <div className="flex h-48 items-center justify-center border border-dashed rounded-lg">
            <div className="text-center text-muted-foreground">
              <div className="text-4xl mb-2">📊</div>
              <p className="italic">No assessment data available</p>
            </div>
          </div>
        ) : (
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
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="title"
                    height={60}
                    interval={0}
                    tick={<CustomAxisTick />}
                    className="fill-muted-foreground"
                  />
                  <YAxis
                    className="fill-muted-foreground"
                    label={{
                      value: "Score (Points)",
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
                  <Tooltip content={<AssessmentCustomTooltip />} />
                  <Bar
                    dataKey="bestScore"
                    name="Best Score (Points)"
                    radius={[4, 4, 0, 0]}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getScoreColor(
                          entry.bestScore,
                          entry.passingScore,
                        )}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Score Legend */}
        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 text-xs text-muted-foreground mt-2 px-4 sm:px-2">
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-3 h-3 rounded bg-green-500 flex-shrink-0"></div>
            <span className="whitespace-nowrap">Excellent (80-100%)</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-3 h-3 rounded bg-blue-500 flex-shrink-0"></div>
            <span className="whitespace-nowrap">Good (60-79%)</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-3 h-3 rounded bg-amber-500 flex-shrink-0"></div>
            <span className="whitespace-nowrap">Average (40-59%)</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-3 h-3 rounded bg-red-500 flex-shrink-0"></div>
            <span className="whitespace-nowrap">Poor (0-39%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ChartDataItem {
  assessmentId: string;
  title: string;
  topic: string;
  passingScore: number;
  bestScore: number;
  averageScore: number;
  totalAttempts: number;
  timeSpent: number;
  status: "passed" | "failed" | "not_attempted" | "in_progress";
}

const SCORE_COLORS = {
  passed: "#22c55e", // green-500
  close: "#f59e0b", // amber-500
  needsImprovement: "#ef4444", // red-500
  notAttempted: "#9ca3af", // gray-400
};

const getScoreColor = (bestScore: number, passingScore: number): string => {
  if (bestScore === 0) return SCORE_COLORS.notAttempted;
  if (bestScore >= passingScore) return SCORE_COLORS.passed;
  if (bestScore >= passingScore * 0.7) return SCORE_COLORS.close;
  return SCORE_COLORS.needsImprovement;
};

const getAssessmentStats = (
  assessments: Assessment[],
  attempts: AssessmentAttempt[],
): ChartDataItem[] => {
  return assessments.map((assessment) => {
    const assessmentAttempts = attempts.filter(
      (attempt) => attempt.assessmentId === assessment.id,
    );

    const completedAttempts = assessmentAttempts.filter(
      (attempt) => attempt.status === "completed",
    );

    // calculate best score from completed attempts
    const bestScore =
      completedAttempts.length > 0
        ? Math.max(...completedAttempts.map((attempt) => attempt.score))
        : 0;

    const averageScore =
      completedAttempts.length > 0
        ? completedAttempts.reduce((sum, attempt) => sum + attempt.score, 0) /
        completedAttempts.length
        : 0;

    let status: "passed" | "failed" | "not_attempted" | "in_progress" =
      "not_attempted";

    if (completedAttempts.length > 0) {
      status = bestScore >= assessment.passingScore ? "passed" : "failed";
    } else if (assessmentAttempts.length > 0) {
      status = "in_progress";
    }

    const totalTimeSpent = completedAttempts.reduce(
      (total, attempt) => total + attempt.timeSpent,
      0,
    );

    return {
      assessmentId: assessment.id,
      title: assessment.title || "Untitled Assessment",
      topic: assessment.topic || "General",
      passingScore: assessment.passingScore,
      bestScore,
      averageScore,
      totalAttempts: assessmentAttempts.length,
      timeSpent: totalTimeSpent,
      status,
    };
  });
};

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
};

const AssessmentCustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload as ChartDataItem;

    return (
      <div className="bg-background border rounded-lg shadow-lg p-3 text-xs max-w-[400px]">
        <p className="font-bold text-sm mb-1 truncate">{data.title}</p>
        <p className="text-muted-foreground mb-2 truncate text-[11px]">
          {data.topic}
        </p>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-nowrap">Best Score:</span>
              <Badge
                variant="outline"
                className={
                  data.bestScore >= data.passingScore
                    ? "text-green-600 border-green-600"
                    : data.bestScore >= data.passingScore * 0.7
                      ? "text-amber-600 border-amber-600"
                      : data.bestScore === 0
                        ? "text-muted-foreground border-muted"
                        : "text-red-600 border-red-600"
                }
              >
                {data.bestScore} pts
              </Badge>
            </div>
            <div className="flex gap-2 justify-between items-center text-nowrap">
              <span className="text-nowrap">Passing Score:</span>
              <span className="font-semibold">{data.passingScore} pts</span>
            </div>
          </div>

          <div className="flex-1 border-l border-border pl-4">
            <div className="flex gap-2 justify-between items-center mb-1">
              <span className="text-blue-600 font-semibold text-nowrap">
                Attempts:
              </span>
              <span className="text-muted-foreground text-nowrap">
                {data.totalAttempts}
              </span>
            </div>
            <div className="flex gap-2 justify-between items-center">
              <span className="text-purple-600 font-semibold text-nowrap">
                Time Spent:
              </span>
              <span className="text-muted-foreground text-nowrap">
                {data.totalAttempts > 0
                  ? formatDuration(data.timeSpent)
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
