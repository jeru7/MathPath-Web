import { type ReactElement, useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
  AreaChart,
  Area,
} from "recharts";
import { useTeacherAssessmentOverview } from "../../../../services/teacher-stats.service";
import { useAdminAssessmentOverview } from "@/modules/admin/services/admin-stats.service";
import { AssessmentListItem } from "../../../../../core/types/assessment/assessment-stats.type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = {
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--secondary))",
  success: "hsl(var(--success))",
  warning: "hsl(var(--warning))",
  error: "hsl(var(--destructive))",
  muted: "hsl(var(--muted-foreground))",
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  draft: { label: "Draft", color: COLORS.muted },
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

interface MetricsGridProps {
  overview: {
    totalAssessments: number;
    totalAttempts: number;
    completionRate: number;
    passRate: number;
    averageTimeSpent: number;
  };
}

interface MetricCardProps {
  label: string;
  value: number;
  format: "number" | "percentage" | "time";
}

interface PassRateTrendProps {
  passRateData: PassRateDataItem[];
  assessments: AssessmentListItem[];
  onAssessmentClick: (assessment: AssessmentListItem) => void;
}

interface AssessmentsListProps {
  assessments: AssessmentListItem[];
  onAssessmentClick: (assessment: AssessmentListItem) => void;
}

interface AssessmentItemProps {
  assessment: AssessmentListItem;
  onClick: (assessment: AssessmentListItem) => void;
}

interface AssessmentDetailModalProps {
  assessment: AssessmentListItem;
}

function AssessmentStatisticsSkeleton(): ReactElement {
  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Card key={index} className="p-4 text-center">
                <CardContent className="p-0">
                  <Skeleton className="h-7 mb-1" />
                  <Skeleton className="h-4" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4">
              <CardHeader className="p-0 pb-4">
                <Skeleton className="h-5 w-40" />
              </CardHeader>
              <CardContent className="p-0">
                <Skeleton className="h-48" />
              </CardContent>
            </Card>
            <Card className="p-4">
              <CardHeader className="p-0 pb-4">
                <Skeleton className="h-5 w-40" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-48 space-y-2">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index} className="p-3">
                      <CardContent className="p-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <Skeleton className="w-2 h-2 rounded-full" />
                            <div className="min-w-0 flex-1">
                              <Skeleton className="h-4 mb-1" />
                              <Skeleton className="h-3 w-3/4" />
                            </div>
                          </div>
                          <Skeleton className="w-4 h-4" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Simple components - no memo
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
    <Card className="p-4 text-center">
      <CardContent className="p-0">
        <div className="text-2xl font-bold">{formatValue()}</div>
        <div className="text-xs text-muted-foreground mt-1 font-medium">
          {label}
        </div>
      </CardContent>
    </Card>
  );
}

function PassRateTrend({
  passRateData,
  assessments,
  onAssessmentClick,
}: PassRateTrendProps): ReactElement {
  const hasData = passRateData.length > 0;

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as PassRateDataItem;
      const assessment = assessments.find((a) => a.id === data.assessmentId);

      return (
        <div className="bg-background border rounded-lg shadow-lg p-3 text-xs max-w-[300px]">
          <p className="font-bold text-sm mb-1 truncate">
            {assessment?.title || label}
          </p>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Pass Rate:</span>
              <span className="font-bold text-green-600">{data.passRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Attempts:</span>
              <span className="font-semibold">{data.attempts}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const handleChartClick = (data: {
    activePayload?: { payload: PassRateDataItem }[];
  }) => {
    if (data?.activePayload?.[0]?.payload) {
      const clickedData = data.activePayload[0].payload;
      const assessment = assessments.find(
        (a) => a.id === clickedData.assessmentId,
      );
      if (assessment) onAssessmentClick(assessment);
    }
  };

  if (!hasData) {
    return (
      <Card className="p-4">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-sm font-semibold">
            Passing Rate Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-48 flex items-center justify-center text-muted-foreground">
            <p className="text-sm">No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-sm font-semibold">
          Passing Rate Trend
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-48">
          <div className="w-full overflow-x-auto xl:overflow-x-hidden">
            <div className="min-w-[600px] xl:min-w-min h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={passRateData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  onClick={handleChartClick}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="name"
                    tick={false}
                    axisLine={false}
                    height={10}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v: number) => `${v}%`}
                    className="fill-muted-foreground"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="passRate"
                    name="Pass Rate (%)"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.3}
                    strokeWidth={2}
                    cursor="pointer"
                    dot={{
                      fill: "hsl(var(--chart-1))",
                      strokeWidth: 4,
                      r: 2,
                      stroke: "hsl(var(--chart-1))",
                    }}
                    activeDot={{
                      fill: "white",
                      stroke: "hsl(var(--chart-1))",
                      strokeWidth: 2,
                      r: 5,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AssessmentsList({
  assessments,
  onAssessmentClick,
}: AssessmentsListProps): ReactElement {
  const hasAssessments = assessments && assessments.length > 0;

  return (
    <Card className="p-4">
      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-sm font-semibold">
          Recent Assessments
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
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
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <p className="text-sm">No data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function AssessmentItem({
  assessment,
  onClick,
}: AssessmentItemProps): ReactElement {
  const statusConfig = STATUS_CONFIG[assessment.status] || STATUS_CONFIG.draft;

  const handleClick = () => {
    onClick(assessment);
  };

  return (
    <Card
      className="p-3 hover:shadow-sm transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: statusConfig.color }}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{assessment.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {statusConfig.label} • {assessment.totalAttempts} attempts
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />
        </div>
      </CardContent>
    </Card>
  );
}

function AssessmentDetailModal({
  assessment,
}: AssessmentDetailModalProps): ReactElement {
  const statusConfig = STATUS_CONFIG[assessment.status] || STATUS_CONFIG.draft;

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return minutes > 0 ? `${minutes}m ${remaining}s` : `${remaining}s`;
  };

  const metrics = [
    {
      label: "Total Attempts",
      value: assessment.totalAttempts.toLocaleString(),
    },
    { label: "Completion Rate", value: `${assessment.completionRate}%` },
    { label: "Pass Rate", value: `${assessment.passRate}%` },
    { label: "Average Time", value: formatTime(assessment.averageTimeSpent) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h4 className="text-xl font-semibold break-words">
          {assessment.title}
        </h4>
        <div className="flex items-center space-x-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: statusConfig.color }}
          />
          <span className="text-sm text-muted-foreground">
            {statusConfig.label}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="flex items-center justify-between py-3 border-b border-border last:border-b-0"
          >
            <span className="text-sm font-medium text-muted-foreground">
              {m.label}
            </span>
            <span className="text-base sm:text-lg font-semibold">
              {m.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

type AssessmentStatisticsProps = {
  userType: "admin" | "teacher";
  userId: string;
};

export default function AssessmentStatistics({
  userType,
  userId,
}: AssessmentStatisticsProps): ReactElement {
  const useAssessmentOverview =
    userType === "teacher"
      ? useTeacherAssessmentOverview
      : useAdminAssessmentOverview;

  const { data: stats, isLoading: assessmentStatsLoading } =
    useAssessmentOverview(userId);
  const [selectedAssessment, setSelectedAssessment] =
    useState<AssessmentListItem | null>(null);

  const isLoading = assessmentStatsLoading;

  const passRateData =
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

  const handleAssessmentClick = (assessment: AssessmentListItem) => {
    setSelectedAssessment(assessment);
  };

  const closeModal = () => {
    setSelectedAssessment(null);
  };

  if (isLoading) {
    return <AssessmentStatisticsSkeleton />;
  }

  if (!stats) {
    return (
      <Card className="w-full">
        <CardContent className="flex h-48 items-center justify-center p-6">
          <div className="text-center">
            <p className="text-muted-foreground">
              No assessment data available
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Assessment Overview
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Performance metrics and assessment analytics
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
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
        </CardContent>
      </Card>

      <Dialog open={!!selectedAssessment} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assessment Details</DialogTitle>
          </DialogHeader>
          {selectedAssessment && (
            <AssessmentDetailModal assessment={selectedAssessment} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
