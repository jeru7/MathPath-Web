import { type ReactElement, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTeacherContext } from "../../../context/teacher.context";
import { useTeacherAssessmentOverview } from "../../../services/teacher-stats.service";
import { AssessmentListItem } from "../../../../core/types/assessment/assessment-stats.type";
import { FaTimes } from "react-icons/fa";

const COLORS = {
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  gray: "#6b7280",
};

const STATUS_COLORS: Record<string, string> = {
  draft: COLORS.gray,
  published: COLORS.primary,
  "in-progress": COLORS.warning,
  finished: COLORS.success,
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  published: "Published",
  "in-progress": "In Progress",
  finished: "Finished",
};

export default function AssessmentStatistics(): ReactElement {
  const { teacherId } = useTeacherContext();
  const { data: stats, isLoading } = useTeacherAssessmentOverview(teacherId);
  const [selectedAssessment, setSelectedAssessment] =
    useState<AssessmentListItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAssessmentClick = (assessment: AssessmentListItem) => {
    setSelectedAssessment(assessment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAssessment(null);
  };

  if (isLoading) {
    return (
      <article className="bg-white dark:bg-gray-800 shadow-sm p-6 rounded-sm flex-1 flex flex-col gap-4 border border-white dark:border-gray-700 transition-colors duration-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </article>
    );
  }

  return (
    <>
      <article className="bg-white dark:bg-gray-800 shadow-sm p-2 rounded-sm flex-1 flex flex-col gap-4 border border-white dark:border-gray-700 transition-colors duration-200">
        <header className="text-gray-900 dark:text-gray-100">
          <div>
            <h3 className="text-lg font-semibold dark:text-gray-200">
              Assessments
            </h3>
            <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mt-1">
              Overall performance and metrics
            </p>
          </div>
        </header>

        {stats ? (
          <div className="space-y-4">
            {/* overview */}
            <div className="grid grid-cols-3 gap-2">
              <CompactMetricCard
                label="Assessments"
                value={stats.overview.totalAssessments}
                format="number"
              />
              <CompactMetricCard
                label="Attempts"
                value={stats.overview.totalAttempts}
                format="number"
              />
              <CompactMetricCard
                label="Avg Score"
                value={stats.overview.averageScore}
                format="percentage"
              />
              <CompactMetricCard
                label="Completion"
                value={stats.overview.completionRate}
                format="percentage"
              />
              <CompactMetricCard
                label="Pass Rate"
                value={stats.overview.passRate}
                format="percentage"
              />
              <CompactMetricCard
                label="Avg Time"
                value={stats.overview.averageTimeSpent}
                format="time"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* chart */}
              <div className="bg-inherit p-3 rounded-sm border border-gray-300 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                  Performance Trend
                </h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.trendData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="opacity-30"
                      />
                      <XAxis
                        dataKey="label"
                        fontSize={11}
                        tick={{ fill: "currentColor" }}
                        className="text-gray-600 dark:text-gray-400"
                      />
                      <YAxis
                        fontSize={11}
                        tick={{ fill: "currentColor" }}
                        className="text-gray-600 dark:text-gray-400"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgb(255, 255, 255)",
                          borderColor: "rgb(229, 231, 235)",
                          borderRadius: "0.375rem",
                          color: "rgb(17, 24, 39)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={COLORS.primary}
                        strokeWidth={2}
                        dot={{ fill: COLORS.primary, strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* assessments list */}
              <div className="bg-inherit p-3 rounded-sm border border-gray-300 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                  Assessments
                </h4>
                <div className="h-48 overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-300 dark:border-gray-600">
                        <th className="text-left pb-2 font-medium text-gray-600 dark:text-gray-400">
                          Assessment
                        </th>
                        <th className="text-right pb-2 font-medium text-gray-600 dark:text-gray-400">
                          Score
                        </th>
                        <th className="text-right pb-2 font-medium text-gray-600 dark:text-gray-400">
                          Attempts
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      {stats.assessments.map((assessment) => (
                        <tr
                          key={assessment.id}
                          className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                          onClick={() => handleAssessmentClick(assessment)}
                        >
                          <td className="py-2">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{
                                  backgroundColor:
                                    STATUS_COLORS[assessment.status],
                                }}
                              />
                              <span className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-[120px]">
                                {assessment.title}
                              </span>
                            </div>
                          </td>
                          <td className="text-right py-2">
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {assessment.averageScore}%
                            </span>
                          </td>
                          <td className="text-right py-2">
                            <span className="text-gray-600 dark:text-gray-400">
                              {assessment.totalAttempts}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-2">📊</div>
              <p className="italic">No assessment data available</p>
            </div>
          </div>
        )}
      </article>

      {/* assessment detail modal */}
      {isModalOpen && selectedAssessment && (
        <AssessmentDetailModal
          assessment={selectedAssessment}
          onClose={closeModal}
        />
      )}
    </>
  );
}

// TODO: separate file
interface CompactMetricCardProps {
  label: string;
  value: number;
  format: "number" | "percentage" | "time";
}

function CompactMetricCard({
  label,
  value,
  format,
}: CompactMetricCardProps): ReactElement {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes === 0) {
      return `${remainingSeconds}s`;
    }

    if (remainingSeconds === 0) {
      return `${minutes}m`;
    }

    return `${minutes}m ${remainingSeconds}s`;
  };

  const formattedValue =
    format === "percentage"
      ? `${value.toFixed(0)}%`
      : format === "time"
        ? formatTime(value)
        : value.toLocaleString();

  return (
    <div className="bg-inherit border border-gray-300 dark:border-gray-700 p-3 rounded-sm text-center">
      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
        {formattedValue}
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
        {label}
      </div>
    </div>
  );
}

interface AssessmentDetailModalProps {
  assessment: AssessmentListItem;
  onClose: () => void;
}

function AssessmentDetailModal({
  assessment,
  onClose,
}: AssessmentDetailModalProps): ReactElement {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes === 0) {
      return `${remainingSeconds} seconds`;
    }

    if (remainingSeconds === 0) {
      return `${minutes} minutes`;
    }

    return `${minutes} minutes ${remainingSeconds} seconds`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 z-50">
      <div className="bg-white border border-white dark:border-gray-700 dark:bg-gray-800 rounded-sm shadow-sm max-w-md w-full max-h-[90vh] overflow-y-auto">
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Assessment Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </header>

        <div className="p-4 space-y-4">
          {/* assessment title and status */}
          <div className="space-y-2">
            <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {assessment.title}
            </h4>
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: STATUS_COLORS[assessment.status],
                }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {STATUS_LABELS[assessment.status]}
              </span>
            </div>
          </div>

          {/* metrics list */}
          <div className="space-y-3">
            <MetricRow
              label="Total Attempts"
              value={assessment.totalAttempts.toString()}
            />
            <MetricRow
              label="Average Score"
              value={`${assessment.averageScore}%`}
            />
            <MetricRow
              label="Completion Rate"
              value={`${assessment.completionRate}%`}
            />
            <MetricRow label="Pass Rate" value={`${assessment.passRate}%`} />
            <MetricRow
              label="Average Time"
              value={formatTime(assessment.averageTimeSpent)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface MetricRowProps {
  label: string;
  value: string;
}

function MetricRow({ label, value }: MetricRowProps): ReactElement {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {label}
      </span>
      <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {value}
      </span>
    </div>
  );
}
