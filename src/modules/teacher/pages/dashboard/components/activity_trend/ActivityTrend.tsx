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
import {
  ActivityRange,
  ActivityResultDay,
  ActivityResultToday,
} from "../../../../../core/types/stats/activity-trend.type";
import { useParams } from "react-router-dom";
import { useTeacherActivityTrend } from "../../../../services/teacher-stats.service";

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
const formatHour = (hour: number) => {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour} ${period}`;
};

const getMonthName = (monthNumber: number) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[monthNumber - 1];
};

export default function ActivityTrend({
  classes,
}: ActivityTrendProps): ReactElement {
  const [range, setRange] = useState<ActivityRange>("today");
  const { teacherId } = useParams();
  const { data: activityTrend } = useTeacherActivityTrend(
    teacherId ?? "",
    range,
  );

  console.log(activityTrend);

  const chartData = activityTrend?.map((d) => {
    if (range === "today") {
      return { ...d, label: formatHour((d as ActivityResultToday).hour) };
    }

    if ((d as ActivityResultDay).date) {
      const monthName = getMonthName((d as ActivityResultDay).date.month);
      return {
        ...d,
        label: `${monthName} ${(d as ActivityResultDay).date.day}`,
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
          Student Activity Trend
        </p>

        {activityTrend && activityTrend?.length > 0 && (
          <div className="flex gap-2">
            <section className="flex"></section>
            <div className="flex gap-2">
              {["today", "7d", "2w"].map((item) => (
                <button
                  key={item}
                  onClick={() => setRange(item as ActivityRange)}
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
          className={`flex min-h-[300px] flex-1 ${activityTrend && activityTrend?.length > 0 ? "min-w-[1000px] " : "w-full"}`}
        >
          {activityTrend && activityTrend?.length > 0 ? (
            <ResponsiveContainer className={""}>
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
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-300 italic text-sm md:text-base">
                No data available
              </p>
            </div>
          )}
        </div>
      </section>
    </article>
  );
}
