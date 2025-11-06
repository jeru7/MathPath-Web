import { type ReactElement, useMemo } from "react";
import CalendarHeatmap, {
  ReactCalendarHeatmapValue,
} from "react-calendar-heatmap";
import { Tooltip } from "react-tooltip";
import { format } from "date-fns-tz";
import {
  useStudentAttempts,
  useStudentProgressLog,
} from "../../../services/student.service";
import { ProgressLog } from "../../../../core/types/progress-log/progress-log.type";
import { StageAttempt } from "../../../../core/types/stage-attempt/stage-attempt.type";
import "../../../../core/styles/customHeatmap.css";

type StudentHeatmapProps = {
  studentId: string;
};

export default function StudentHeatmap({
  studentId,
}: StudentHeatmapProps): ReactElement {
  const { data: studentProgressLog } = useStudentProgressLog(studentId || "");
  const { data: studentStageAttempts } = useStudentAttempts(studentId);

  const { startDate, endDate } = useMemo(getCurrentYearRange, []);
  const chartData = useMemo(
    () => getHeatmapData(studentProgressLog || [], studentStageAttempts || []),
    [studentProgressLog, studentStageAttempts],
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
          <div>Quests Completed: ${heatmapValue.completedQuest.length}</div>
          <div>Minutes Played: ${heatmapValue.minutesPlayed}</div>
        </div>
      `,
    };
  };

  return (
    <div className="flex flex-col justify-between bg-white dark:bg-gray-800 p-3 w-full h-full transition-colors duration-200">
      <header className="mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">
          Activity Map
        </h3>
      </header>

      <div className="flex max-w-full overflow-x-auto overflow-y-clip">
        <div className="w-full -mb-8 min-w-[1200px]">
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
        className="z-50 dark:bg-gray-700 dark:text-gray-100"
      />

      <div className="flex self-end items-center justify-end mt-4 text-sm text-gray-600 dark:text-gray-400 gap-2 transition-colors duration-200">
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
    </div>
  );
}

interface HeatmapData extends ReactCalendarHeatmapValue<string> {
  date: string;
  count: number;
  minutesPlayed: number;
  stagesPlayed: number;
  totalWins: number;
  completedQuest: string[];
}

const getHeatmapData = (
  progressLogs: ProgressLog[] = [],
  stageAttempts: StageAttempt[] = [],
): HeatmapData[] => {
  //  map of seconds played by date from stage attempts
  const secondsPlayedByDate: Record<string, number> = {};

  stageAttempts.forEach((attempt) => {
    const date = format(new Date(attempt.date), "yyyy-MM-dd", {
      timeZone: "Asia/Manila",
    });

    secondsPlayedByDate[date] =
      (secondsPlayedByDate[date] || 0) + (attempt.secondsPlayed || 0);
  });

  return progressLogs.map((log) => {
    const date = format(new Date(log.date), "yyyy-MM-dd", {
      timeZone: "Asia/Manila",
    });

    // get seconds from stage attempts for this date, default to 0 if no attempts
    const secondsFromAttempts = secondsPlayedByDate[date] || 0;
    const minutesPlayed = Math.floor(secondsFromAttempts / 60);

    return {
      date,
      count: log.stagesPlayed + log.totalStageWins + log.completedQuest.length,
      minutesPlayed,
      stagesPlayed: log.stagesPlayed,
      totalWins: log.totalStageWins,
      completedQuest: log.completedQuest,
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
