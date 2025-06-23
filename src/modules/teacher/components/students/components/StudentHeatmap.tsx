import { type ReactElement } from "react";
import CalendarHeatmap, {
  ReactCalendarHeatmapValue,
} from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { useParams } from "react-router-dom";
import { useStudentProgressLog } from "../../../../hooks/useStudent";
import "../../../../index.css";
import { format } from "date-fns";
import { ProgressLog } from "../../../../types/progress_log/progress_log.types";

// normalization ng data para madali ma access sa heatmap
function getQuestionStats(data: ProgressLog[] = []) {
  return data.map((progressLog) => ({
    date: progressLog.date.slice(0, 10),
    count:
      progressLog.stagesPlayed +
      progressLog.totalStageWins +
      progressLog.completedQuest.length,
    minutesPlayed: Math.floor(progressLog.secondsPlayed / 60),
    stagesPlayed: progressLog.stagesPlayed,
    totalWins: progressLog.totalStageWins,
    completedQuest: progressLog.completedQuest,
  }));
}

// error siya sa library - https://github.com/kevinsqi/react-calendar-heatmap/issues/146
// @ts-expect-error: override internal method to adjust heatmap height
CalendarHeatmap.prototype.getHeight = function () {
  return (
    // @ts-expect-error: override internal method to adjust heatmap height
    this.getWeekWidth() + (this.getMonthLabelSize() - this.props.gutterSize)
  );
};

export default function StudentHeatmap(): ReactElement {
  const { studentId } = useParams();
  const { data: studentProgressLog } = useStudentProgressLog(studentId || "");

  const currentYear = new Date().getFullYear();
  const startDate = new Date(`${currentYear}-1-1`);
  const endDate = new Date(`${currentYear}-12-31`);

  const chartData = studentProgressLog
    ? getQuestionStats(studentProgressLog)
    : [];

  const tooltipDataAttrs = (
    value: ReactCalendarHeatmapValue<string> | undefined,
  ): Record<string, string> => {
    if (!value || !value.date) {
      return {
        "data-tooltip-id": "heatmap-tooltip",
        "data-tooltip-content": "No activity",
      };
    }

    const formattedDate = format(new Date(value.date), "MMMM dd, yyyy");

    return {
      "data-tooltip-id": "heatmap-tooltip",
      "data-tooltip-html": `
      <div>
        <span>Date: ${formattedDate}</span><br />
        <span>Game Levels Played: ${value.gameLevelsPlayed}</span><br />
        <span>Wins: ${value.totalWins}</span><br />
        <span>Quests Completed: ${value.completedQuest.length}</span><br />
        <span>Minutes: ${value.minutesPlayed}</span>
      </div>
    `,
    };
  };

  return (
    <div className="w-full h-full flex-col gap-8 flex justify-center py-8 pr-8">
      <header className="pl-8">
        <h3 className="text-2xl font-bold">Activity Map</h3>
      </header>
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={chartData}
        showWeekdayLabels={true}
        weekdayLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
        classForValue={(value) => {
          if (!value || value.count === 0) return "color-empty";
          if (value.count > 15) return "color-high";
          if (value.count > 7) return "color-medium";
          return "color-low";
        }}
        tooltipDataAttrs={tooltipDataAttrs}
      />
      <Tooltip id="heatmap-tooltip" />
    </div>
  );
}
