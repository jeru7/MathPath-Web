import { type ReactElement, useMemo } from "react";
import CalendarHeatmap, {
  ReactCalendarHeatmapValue,
} from "react-calendar-heatmap";
import { Tooltip } from "react-tooltip";
import { useParams } from "react-router-dom";
import { format } from "date-fns-tz";
import { useStudentProgressLog } from "../../../services/student.service";
import { ProgressLog } from "../../../../core/types/progress-log/progress-log.type";
import "../../../../core/styles/customHeatmap.css";

export default function StudentHeatmap(): ReactElement {
  const { studentId } = useParams();
  const { data: studentProgressLog } = useStudentProgressLog(studentId || "");

  const { startDate, endDate } = useMemo(getCurrentYearRange, []);
  const chartData = useMemo(
    () => getHeatmapData(studentProgressLog),
    [studentProgressLog],
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
    <div className="flex flex-col justify-between bg-white p-3 w-full h-full">
      <header className="mb-4">
        <h3 className="font-semibold text-gray-900">Activity Map</h3>
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
      <Tooltip id="heatmap-tooltip" className="z-50" />

      <div className="flex self-end items-center justify-end mt-4 text-sm text-gray-600 gap-2">
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

const getHeatmapData = (data: ProgressLog[] = []): HeatmapData[] => {
  return data.map((log) => ({
    date: format(new Date(log.date), "yyyy-MM-dd", {
      timeZone: "Asia/Manila",
    }),
    count: log.stagesPlayed + log.totalStageWins + log.completedQuest.length,
    minutesPlayed: Math.floor(log.secondsPlayed / 60),
    stagesPlayed: log.stagesPlayed,
    totalWins: log.totalStageWins,
    completedQuest: log.completedQuest,
  }));
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
