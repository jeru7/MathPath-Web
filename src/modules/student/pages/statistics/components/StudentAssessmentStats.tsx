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
      <article className="bg-white dark:bg-gray-800 shadow-sm p-6 rounded-lg flex-1 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400 mx-auto mb-2 transition-colors duration-200"></div>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
              Loading assessment statistics...
            </p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="bg-white dark:bg-gray-800 p-3 rounded-sm flex flex-col justify-around h-full w-full overflow-x-hidden transition-colors duration-200">
      <header className="">
        <div className="flex flex-col gap-2">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">
              Assessments
            </h3>
          </div>
        </div>
      </header>

      {chartData.length === 0 ? (
        <div className="flex h-48 items-center justify-center border border-gray-200 dark:border-gray-700 rounded-lg transition-colors duration-200">
          <div className="text-center text-gray-500 dark:text-gray-400 transition-colors duration-200">
            <div className="text-4xl mb-2">📊</div>
            <p className="italic">No assessment data available</p>
          </div>
        </div>
      ) : (
        <div className="w-full h-fit overflow-x-auto overflow-y-clip">
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
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0f0f0"
                  className="dark:stroke-gray-600"
                />
                <XAxis
                  dataKey="title"
                  height={60}
                  interval={0}
                  tick={<CustomAxisTick />}
                  className="dark:text-gray-300"
                />
                <YAxis
                  className="dark:text-gray-300"
                  label={{
                    value: "Score (Points)",
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
                <Tooltip content={<AssessmentCustomTooltip />} />
                <Bar
                  dataKey="bestScore"
                  name="Best Score (Points)"
                  radius={[4, 4, 0, 0]}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getScoreColor(entry.bestScore, entry.passingScore)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* score legend */}
      <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 text-xs text-gray-600 dark:text-gray-400 mt-2 px-4 sm:px-2 transition-colors duration-200">
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-3 h-3 rounded bg-green-500 flex-shrink-0"></div>
          <span className="whitespace-nowrap dark:text-gray-300">
            Excellent (80-100%)
          </span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-3 h-3 rounded bg-blue-500 flex-shrink-0"></div>
          <span className="whitespace-nowrap dark:text-gray-300">
            Good (60-79%)
          </span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-3 h-3 rounded bg-amber-500 flex-shrink-0"></div>
          <span className="whitespace-nowrap dark:text-gray-300">
            Average (40-59%)
          </span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-3 h-3 rounded bg-red-500 flex-shrink-0"></div>
          <span className="whitespace-nowrap dark:text-gray-300">
            Poor (0-39%)
          </span>
        </div>
      </div>
    </article>
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
      <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 text-xs max-w-[400px] transition-colors duration-200">
        <p className="font-bold text-sm mb-1 text-gray-900 dark:text-gray-100 truncate transition-colors duration-200">
          {data.title}
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-2 truncate text-[11px] transition-colors duration-200">
          {data.topic}
        </p>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-700 dark:text-gray-300 text-nowrap transition-colors duration-200">
                Best Score:
              </span>
              <span
                className={`font-bold text-nowrap ${data.bestScore >= data.passingScore
                    ? "text-green-600 dark:text-green-400"
                    : data.bestScore >= data.passingScore * 0.7
                      ? "text-amber-600 dark:text-amber-400"
                      : data.bestScore === 0
                        ? "text-gray-600 dark:text-gray-400"
                        : "text-red-600 dark:text-red-400"
                  } transition-colors duration-200`}
              >
                {data.bestScore} pts
              </span>
            </div>
            <div className="flex gap-2 justify-between items-center text-nowrap">
              <span className="text-gray-700 dark:text-gray-300 text-nowrap transition-colors duration-200">
                Passing Score:
              </span>
              <span className="font-semibold dark:text-gray-300 transition-colors duration-200">
                {data.passingScore} pts
              </span>
            </div>
          </div>

          <div className="flex-1 border-l border-gray-200 dark:border-gray-600 pl-4 transition-colors duration-200">
            <div className="flex gap-2 justify-between items-center mb-1">
              <span className="text-blue-600 dark:text-blue-400 font-semibold text-nowrap transition-colors duration-200">
                Attempts:
              </span>
              <span className="text-gray-600 dark:text-gray-400 text-nowrap transition-colors duration-200">
                {data.totalAttempts}
              </span>
            </div>
            <div className="flex gap-2 justify-between items-center">
              <span className="text-purple-600 dark:text-purple-400 font-semibold text-nowrap transition-colors duration-200">
                Time Spent:
              </span>
              <span className="text-gray-600 dark:text-gray-400 text-nowrap transition-colors duration-200">
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
