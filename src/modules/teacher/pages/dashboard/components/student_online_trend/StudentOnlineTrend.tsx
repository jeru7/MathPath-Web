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

export default function StudentOnlineTrend({
  classes,
}: ActivityTrendProps): ReactElement {
  const [range, setRange] = useState<OnlineTrendRange>("today");
  const { teacherId } = useParams();
  const { data: activityTrend } = useTeacherOnlineTrend(teacherId ?? "", range);

  console.log(activityTrend);

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
      className={`${classes} rounded-sm shadow-sm bg-white dark:bg-gray-800 flex flex-col p-2 gap-1 min-h-[400px] border border-gray-200 dark:border-gray-700 transition-colors duration-200`}
    >
      <header className="flex justify-between w-full items-center">
        <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">
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
                  className={`px-3 py-1 rounded-md text-xs md:text-sm hover:cursor-pointer transition-colors duration-200 ${range === item
                      ? "bg-[var(--secondary-green)]/80 dark:bg-green-600 text-black dark:text-white hover:bg-[var(--secondary-green)] dark:hover:bg-green-500"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
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
          className={`flex flex-col min-h-[300px] flex-1 ${activityTrend && activityTrend?.length > 0
              ? "min-w-[1000px] "
              : "w-full"
            }`}
        >
          {activityTrend && activityTrend?.length > 0 ? (
            <ResponsiveContainer className={"w-full flex-1"}>
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -30, bottom: 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                  className="dark:stroke-gray-600"
                />
                <XAxis
                  dataKey="label"
                  tick={{
                    fontSize: 12,
                    fontWeight: 600,
                    dy: 10,
                    fill: "#6b7280",
                  }}
                  className="dark:text-gray-300"
                />
                <YAxis
                  allowDecimals={false}
                  tick={{
                    fontSize: 12,
                    fontWeight: 600,
                    dx: -10,
                    fill: "#6b7280",
                  }}
                  className="dark:text-gray-300"
                />
                <Tooltip
                  content={({ active, payload, label }) =>
                    active && payload && payload.length ? (
                      <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 text-sm transition-colors duration-200">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {label}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          Online: {payload[0].value}
                        </p>
                      </div>
                    ) : null
                  }
                />
                <Area
                  type="monotone"
                  dataKey="onlineCount"
                  stroke="#22c55e"
                  fill="#bbf7d0"
                  className="dark:stroke-green-400 dark:fill-green-400/20"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-gray-300 dark:text-gray-500 italic">
                No data available.
              </p>
            </div>
          )}
        </div>
      </section>
    </article>
  );
}
