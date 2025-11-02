import { type ReactElement, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { useTeacherContext } from "../../../context/teacher.context";
import { useTeacherAssessmentOverview } from "../../../services/teacher-stats.service";
import { AssessmentListItem } from "../../../../core/types/assessment/assessment-stats.type";
import { FaTimes } from "react-icons/fa";
import { BsChevronRight } from "react-icons/bs";
import ModalOverlay from "../../../../core/components/modal/ModalOverlay";

const COLORS = {
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  gray: "#6b7280",
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  draft: { label: "Draft", color: COLORS.gray },
  published: { label: "Published", color: COLORS.primary },
  "in-progress": { label: "In Progress", color: COLORS.warning },
  finished: { label: "Finished", color: COLORS.success },
};

interface PassRateDataItem {
  name: string;
  passRate: number;
  attempts: number;
  assessmentId: string;
}

export default function AssessmentStatistics(): ReactElement {
  const { teacherId } = useTeacherContext();
  const { data: stats, isLoading } = useTeacherAssessmentOverview(teacherId);
  const [selectedAssessment, setSelectedAssessment] =
    useState<AssessmentListItem | null>(null);

  const handleAssessmentClick = (assessment: AssessmentListItem) => {
    setSelectedAssessment(assessment);
  };

  const closeModal = () => {
    setSelectedAssessment(null);
  };

  // transform assessments data for pass rate trend chart
  const passRateData: PassRateDataItem[] =
    stats?.assessments
      ?.filter((assessment) => assessment.status !== "draft")
      ?.map((assessment) => ({
        name:
          assessment.title.length > 20
            ? assessment.title.substring(0, 20) + "..."
            : assessment.title,
        passRate: assessment.passRate,
        attempts: assessment.totalAttempts,
        assessmentId: assessment.id,
      })) || [];

  if (isLoading) {
    return <LoadingState />;
  }

  if (!stats) {
    return <EmptyState />;
  }

  return (
    <>
      <article className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <Header />

        <div className="space-y-6">
          <MetricsGrid overview={stats.overview} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PassRateTrend
              passRateData={passRateData}
              onAssessmentClick={handleAssessmentClick}
              assessments={stats.assessments}
            />
            <AssessmentsList
              assessments={stats.assessments}
              onAssessmentClick={handleAssessmentClick}
            />
          </div>
        </div>
      </article>

      <ModalOverlay isOpen={!!selectedAssessment} onClose={closeModal}>
        {selectedAssessment && (
          <AssessmentDetailModal
            assessment={selectedAssessment}
            onClose={closeModal}
          />
        )}
      </ModalOverlay>
    </>
  );
}

// TODO: make this reusable component
function LoadingState(): ReactElement {
  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-20 bg-gray-200 dark:bg-gray-700 rounded"
            ></div>
          ))}
        </div>
      </div>
    </article>
  );
}

function EmptyState(): ReactElement {
  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
      <div className="text-4xl mb-3">📊</div>
      <p className="text-gray-500 dark:text-gray-400">
        No assessment data available
      </p>
    </article>
  );
}

function Header(): ReactElement {
  return (
    <header className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Assessment Overview
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
        Performance metrics and assessment analytics
      </p>
    </header>
  );
}

interface MetricsGridProps {
  overview: {
    totalAssessments: number;
    totalAttempts: number;
    completionRate: number;
    passRate: number;
    averageTimeSpent: number;
  };
}

function MetricsGrid({ overview }: MetricsGridProps): ReactElement {
  const metrics = [
    {
      label: "Total Assessments",
      value: overview.totalAssessments,
      format: "number" as const,
    },
    {
      label: "Attempts",
      value: overview.totalAttempts,
      format: "number" as const,
    },
    {
      label: "Completion Rate",
      value: overview.completionRate,
      format: "percentage" as const,
    },
    {
      label: "Pass Rate",
      value: overview.passRate,
      format: "percentage" as const,
    },
    {
      label: "Avg Time",
      value: overview.averageTimeSpent,
      format: "time" as const,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.label}
          label={metric.label}
          value={metric.value}
          format={metric.format}
        />
      ))}
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: number;
  format: "number" | "percentage" | "time";
}

function MetricCard({ label, value, format }: MetricCardProps): ReactElement {
  const formatValue = () => {
    switch (format) {
      case "percentage":
        return `${value}%`;
      case "time": {
        const minutes = Math.floor(value / 60);
        const seconds = value % 60;
        return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
      }
      default:
        return value.toLocaleString();
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700">
      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {formatValue()}
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">
        {label}
      </div>
    </div>
  );
}

interface PassRateTrendProps {
  passRateData: PassRateDataItem[];
  assessments: AssessmentListItem[];
  onAssessmentClick: (assessment: AssessmentListItem) => void;
}

function PassRateTrend({
  passRateData,
  assessments,
  onAssessmentClick,
}: PassRateTrendProps): ReactElement {
  const hasData = passRateData.length > 0;

  // custom tooltip with proper ts types
  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
    active,
    payload,
    label,
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as PassRateDataItem;
      const assessment = assessments.find((a) => a.id === data.assessmentId);

      return (
        <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 text-xs max-w-[300px] transition-colors duration-200">
          <p className="font-bold text-sm mb-1 text-gray-900 dark:text-white truncate">
            {assessment?.title || label}
          </p>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">
                Pass Rate:
              </span>
              <span className="font-bold text-green-600 dark:text-green-400">
                {data.passRate}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">
                Attempts:
              </span>
              <span className="font-semibold text-gray-900 dark:text-gray-300">
                {data.attempts}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const handleBarClick = (data: PassRateDataItem) => {
    const assessment = assessments.find((a) => a.id === data.assessmentId);
    if (assessment) {
      onAssessmentClick(assessment);
    }
  };

  return (
    <div className="rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Passing Rate Trend
      </h4>

      <div className="h-48">
        {hasData ? (
          <div className="w-full h-fit overflow-x-auto xl:overflow-x-hidden overflow-y-hidden">
            <div className="w-full min-w-[600px] xl:min-w-min h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={passRateData}
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
                    dataKey="name"
                    height={60}
                    interval={0}
                    tick={{
                      fontSize: 11,
                      fill: "currentColor",
                    }}
                    className="text-gray-600 dark:text-gray-400"
                  />
                  <YAxis
                    domain={[0, 100]}
                    className="text-gray-600 dark:text-gray-400"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(value: number) => `${value}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="passRate"
                    name="Pass Rate (%)"
                    radius={[4, 4, 0, 0]}
                    fill="#10b981"
                    onClick={handleBarClick}
                    cursor="pointer"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 rounded-sm">
            <p className="text-sm">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface AssessmentsListProps {
  assessments: AssessmentListItem[];
  onAssessmentClick: (assessment: AssessmentListItem) => void;
}

function AssessmentsList({
  assessments,
  onAssessmentClick,
}: AssessmentsListProps): ReactElement {
  const hasAssessments = assessments && assessments.length > 0;

  return (
    <div className="rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Recent Assessments
      </h4>

      <div className="h-48 overflow-y-auto">
        {hasAssessments ? (
          <div className="space-y-2">
            {assessments.map((assessment) => (
              <AssessmentItem
                key={assessment.id}
                assessment={assessment}
                onClick={onAssessmentClick}
              />
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 rounded-sm">
            <p className="text-sm">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface AssessmentItemProps {
  assessment: AssessmentListItem;
  onClick: (assessment: AssessmentListItem) => void;
}

function AssessmentItem({
  assessment,
  onClick,
}: AssessmentItemProps): ReactElement {
  const statusConfig = STATUS_CONFIG[assessment.status] || STATUS_CONFIG.draft;

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 hover:shadow-sm transition-shadow cursor-pointer"
      onClick={() => onClick(assessment)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: statusConfig.color }}
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {assessment.title}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {statusConfig.label} • {assessment.totalAttempts} attempts
            </p>
          </div>
        </div>
        <BsChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
      </div>
    </div>
  );
}

// modal component
interface AssessmentDetailModalProps {
  assessment: AssessmentListItem;
  onClose: () => void;
}

function AssessmentDetailModal({
  assessment,
  onClose,
}: AssessmentDetailModalProps): ReactElement {
  const statusConfig = STATUS_CONFIG[assessment.status] || STATUS_CONFIG.draft;

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${remainingSeconds}s`;
  };

  const metrics = [
    {
      label: "Total Attempts",
      value: assessment.totalAttempts.toLocaleString(),
    },
    {
      label: "Completion Rate",
      value: `${assessment.completionRate}%`,
    },
    {
      label: "Pass Rate",
      value: `${assessment.passRate}%`,
    },
    {
      label: "Average Time",
      value: formatTime(assessment.averageTimeSpent),
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-sm shadow-sm border border-gray-200 dark:border-gray-700 w-[90dvw] sm:w-[400px]">
      {/* header */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Assessment Details
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded"
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* info */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 sm:pr-4 break-words">
              {assessment.title}
            </h4>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: statusConfig.color }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {statusConfig.label}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {metric.label}
              </span>
              <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                {metric.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
