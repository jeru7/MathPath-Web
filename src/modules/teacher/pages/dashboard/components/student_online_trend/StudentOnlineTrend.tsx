import { useState, type ReactElement } from "react";
import {
  AreaChart,
  Area,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  CartesianGrid,
} from "recharts";
import { capitalizeWord } from "../../../../../core/utils/string.util";
import { useParams } from "react-router-dom";
import { useTeacherOnlineTrend } from "../../../../services/teacher-stats.service";
import { formatHour, getMonthName } from "../../../../../core/utils/date.util";
import {
  OnlineTrendRange,
  OnlineTrendResultDay,
  OnlineTrendResultToday,
} from "../../../../types/student-online-trend.type";

type ActivityTrendProps = {
  classes: string;
};

// const CustomTooltip = ({
//   active,
//   payload,
//   label,
// }: TooltipProps<number, string>) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-white p-2 border border-gray-300 rounded shadow text-sm">
//         <p className="font-medium">Stage: {label}</p>
//         <p>Completed: {payload[0].value}</p>
//       </div>
//     );
//   }
//
//   return null;
// };
//

export default function StudentOnlineTrend({
  classes,
}: ActivityTrendProps): ReactElement {
  const [range, setRange] = useState<OnlineTrendRange>("today");
  const { teacherId } = useParams();
  const { data: activityTrend } = useTeacherOnlineTrend(teacherId ?? "", range);

  const chartData = activityTrend?.map((d) => {
    if (range === "today") {
      return { ...d, label: formatHour((d as OnlineTrendResultToday).hour) };
    }

    if ((d as OnlineTrendResultDay).date) {
      const monthName = getMonthName((d as OnlineTrendResultDay).date.month);
      return {
        ...d,
        label: `${monthName} ${(d as OnlineTrendResultDay).date.day}`,
      };
    }
    return { ...d, label: "N/A" };
  });

  return (
    <article
      className={`${classes} rounded-md shadow-sm bg-white flex flex-col py-2 px-3 gap-1 min-h-[400px]`}
    >
      <header className="flex justify-between w-full items-center">
        <p className="text-sm sm:text-base md:text-lg font-semibold">
          Student Online Trend
        </p>

        {activityTrend && activityTrend?.length > 0 && (
          <div className="flex gap-2">
            <section className="flex"></section>
            <div className="flex gap-2">
              {["today", "7d", "2w"].map((item) => (
                <button
                  key={item}
                  onClick={() => setRange(item as OnlineTrendRange)}
                  className={`px-3 py-1 rounded-md text-xs md:text-sm hover:cursor-pointer ${range === item ? "bg-[var(--secondary-green)]/80 text-black hover:bg-[var(--secondary-green)]" : "bg-gray-100 hover:bg-gray-200"}`}
                >
                  {capitalizeWord(item)}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <section className="flex flex-col flex-1 overflow-x-auto">
        <div
          className={`flex flex-col min-h-[300px] flex-1 ${activityTrend && activityTrend?.length > 0 ? "min-w-[1000px] " : "w-full"}`}
        >
          {activityTrend && activityTrend?.length > 0 ? (
            <ResponsiveContainer className={"w-full flex-1"}>
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -30, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fontWeight: 600, dy: 10 }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fontWeight: 600, dx: -10 }}
                />
                <Tooltip
                  content={({ active, payload, label }) =>
                    active && payload && payload.length ? (
                      <div className="bg-white p-2 rounded shadow text-sm">
                        <p className="font-semibold">{label}</p>
                        <p>Online: {payload[0].value}</p>
                      </div>
                    ) : null
                  }
                />
                <Area
                  type="monotone"
                  dataKey="onlineCount"
                  stroke="#22c55e"
                  fill="#bbf7d0"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-gray-300 italic">No data available.</p>
            </div>
          )}
        </div>
      </section>
    </article>
  );
}
