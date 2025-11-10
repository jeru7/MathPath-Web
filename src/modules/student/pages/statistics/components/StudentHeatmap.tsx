import { type ReactElement, useMemo } from "react";
import CalendarHeatmap, {
  ReactCalendarHeatmapValue,
} from "react-calendar-heatmap";
import { Tooltip } from "react-tooltip";
import { format } from "date-fns-tz";
import { useStudentAttempts } from "../../../services/student.service";
import { StageAttempt } from "../../../../core/types/stage-attempt/stage-attempt.type";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import "../../../../core/styles/customHeatmap.css";

type StudentHeatmapProps = {
  studentId: string;
};

function StudentHeatmapSkeleton(): ReactElement {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="text-lg">
          <Skeleton className="h-6 w-32" />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="w-full">
          <div className="space-y-2">
            <div className="flex justify-between mb-2">
              {Array.from({ length: 12 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-4 flex-1 mx-1 first:ml-0 last:mr-0"
                />
              ))}
            </div>
            <div className="space-y-1">
              {Array.from({ length: 7 }).map((_, weekIndex) => (
                <div key={weekIndex} className="flex gap-1">
                  <Skeleton className="h-3 w-8 flex-shrink-0" />
                  <div className="flex flex-1 gap-1">
                    {Array.from({ length: 52 }).map((_, dayIndex) => (
                      <Skeleton
                        key={dayIndex}
                        className="h-3 flex-1 rounded-sm min-w-[3px]"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="invisible">
          <Tooltip id="heatmap-tooltip" />
        </div>
        <div className="flex self-end items-center justify-end text-sm text-muted-foreground gap-2 mt-4">
          <Skeleton className="h-3 w-8" />
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="w-3 h-3 rounded-sm" />
            ))}
          </div>
          <Skeleton className="h-3 w-8" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function StudentHeatmap({
  studentId,
}: StudentHeatmapProps): ReactElement {
  const { data: studentStageAttempts, isLoading } =
    useStudentAttempts(studentId);

  const { startDate, endDate } = useMemo(getCurrentYearRange, []);
  const chartData = useMemo(
    () => getHeatmapData(studentStageAttempts || []),
    [studentStageAttempts],
  );

  const handleColorClass = (
    value: ReactCalendarHeatmapValue<string> | undefined,
  ) => {
    return getColorIntensity(value?.count ?? 0);
  };

  const handleTooltip = (
    value: ReactCalendarHeatmapValue<string> | undefined,
  ): TooltipDataAttrs => {
    if (!value?.date) {
      return {
        "data-tooltip-id": "heatmap-tooltip",
        "data-tooltip-content": "No activity",
      };
    }

    const heatmapValue = value as HeatmapData;
    const formattedDate = format(new Date(heatmapValue.date), "MMMM dd, yyyy");

    return {
      "data-tooltip-id": "heatmap-tooltip",
      "data-tooltip-html": `
        <div class="space-y-1">
          <div class="font-semibold">${formattedDate}</div>
          <div>Stages Played: ${heatmapValue.stagesPlayed}</div>
          <div>Wins: ${heatmapValue.totalWins}</div>
          <div>Minutes Played: ${heatmapValue.minutesPlayed}</div>
        </div>
      `,
    };
  };

  if (isLoading) {
    return <StudentHeatmapSkeleton />;
  }

  return (
    <Card className="w-full h-full p-2 overflow-hidden">
      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-lg p-0">Activity Map</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="overflow-x-auto">
          <div className="w-full min-w-[1000px]">
            <CalendarHeatmap
              startDate={startDate}
              endDate={endDate}
              values={chartData}
              showWeekdayLabels={true}
              showMonthLabels={true}
              weekdayLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
              classForValue={handleColorClass}
              tooltipDataAttrs={handleTooltip}
              gutterSize={2}
              horizontal={true}
            />
          </div>
        </div>
        <Tooltip
          id="heatmap-tooltip"
          className="z-50 bg-popover text-popover-foreground border rounded-md shadow-md"
        />
        <div className="flex self-end items-center justify-end text-sm text-muted-foreground gap-2">
          <span className="text-xs">Less</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 color-empty rounded-sm"></div>
            <div className="w-3 h-3 color-gitlab-1 rounded-sm"></div>
            <div className="w-3 h-3 color-gitlab-2 rounded-sm"></div>
            <div className="w-3 h-3 color-gitlab-3 rounded-sm"></div>
            <div className="w-3 h-3 color-gitlab-4 rounded-sm"></div>
          </div>
          <span className="text-xs">More</span>
        </div>
      </CardContent>
    </Card>
  );
}

interface HeatmapData extends ReactCalendarHeatmapValue<string> {
  date: string;
  count: number;
  minutesPlayed: number;
  stagesPlayed: number;
  totalWins: number;
}

const getHeatmapData = (stageAttempts: StageAttempt[] = []): HeatmapData[] => {
  const activityByDate: Record<
    string,
    {
      stagesPlayed: number;
      totalWins: number;
      totalSeconds: number;
    }
  > = {};

  stageAttempts.forEach((attempt) => {
    const date = format(new Date(attempt.date), "yyyy-MM-dd", {
      timeZone: "Asia/Manila",
    });

    if (!activityByDate[date]) {
      activityByDate[date] = {
        stagesPlayed: 0,
        totalWins: 0,
        totalSeconds: 0,
      };
    }

    activityByDate[date].stagesPlayed += 1;

    if (attempt.completed && !attempt.fled && !attempt.died) {
      activityByDate[date].totalWins += 1;
    }

    activityByDate[date].totalSeconds += attempt.secondsPlayed || 0;
  });

  return Object.entries(activityByDate).map(([date, data]) => {
    const minutesPlayed = Math.round(data.totalSeconds / 60);
    const count = data.stagesPlayed + data.totalWins;

    return {
      date,
      count,
      minutesPlayed,
      stagesPlayed: data.stagesPlayed,
      totalWins: data.totalWins,
    };
  });
};

const getColorIntensity = (count: number): string => {
  if (count === 0) return "color-empty";
  if (count > 15) return "color-gitlab-4";
  if (count > 7) return "color-gitlab-3";
  if (count > 3) return "color-gitlab-2";
  return "color-gitlab-1";
};

const getCurrentYearRange = () => {
  const currentYear = new Date().getFullYear();
  return {
    startDate: new Date(`${currentYear}-01-01`),
    endDate: new Date(`${currentYear}-12-31`),
  };
};

type TooltipDataAttrs = Record<string, string>;
