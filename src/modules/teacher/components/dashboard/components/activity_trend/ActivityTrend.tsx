import { useEffect, useState, type ReactElement } from "react";
import {
  AreaChart,
  Area,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  CartesianGrid,
} from "recharts";
import { capitalizeWord } from "../../../../../core/utils/string.utils";

interface IActivityTrendProps {
  classes: string;
}

type Range = "today" | "7d" | "2w";

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
}: IActivityTrendProps): ReactElement {
  const [range, setRange] = useState<Range>("today");
  const [data, setData] = useState<any[]>([]);

  const chartData = data.map((d) => {
    if (range === "today") {
      return { ...d, label: formatHour(d.hour) };
    }
    if (d.date) {
      const monthName = getMonthName(d.date.month);
      return { ...d, label: `${monthName} ${d.date.day}` };
    }
    return { ...d, label: "N/A" };
  });

  useEffect(() => {
    if (range === "today") {
      const dummyData = [
        { hour: 8, onlineCount: 2 },
        { hour: 9, onlineCount: 5 },
        { hour: 10, onlineCount: 3 },
        { hour: 11, onlineCount: 7 },
        { hour: 12, onlineCount: 4 },
      ];

      const fullDayData = Array.from({ length: 24 }, (_, i) => {
        const match = dummyData.find((d) => d.hour === i);
        return { hour: i, onlineCount: match ? match.onlineCount : 0 };
      });

      setData(fullDayData);
    } else if (range === "7d") {
      setData([
        { date: { year: 2024, month: 6, day: 20 }, onlineCount: 5 },
        { date: { year: 2024, month: 6, day: 21 }, onlineCount: 3 },
        { date: { year: 2024, month: 6, day: 22 }, onlineCount: 6 },
        { date: { year: 2024, month: 6, day: 23 }, onlineCount: 2 },
        { date: { year: 2024, month: 6, day: 24 }, onlineCount: 4 },
        { date: { year: 2024, month: 6, day: 25 }, onlineCount: 5 },
        { date: { year: 2024, month: 6, day: 26 }, onlineCount: 8 },
      ]);
    } else {
      setData([
        { date: { year: 2024, month: 6, day: 13 }, onlineCount: 2 },
        { date: { year: 2024, month: 6, day: 14 }, onlineCount: 4 },
        { date: { year: 2024, month: 6, day: 15 }, onlineCount: 3 },
        { date: { year: 2024, month: 6, day: 16 }, onlineCount: 5 },
        { date: { year: 2024, month: 6, day: 17 }, onlineCount: 4 },
        { date: { year: 2024, month: 6, day: 18 }, onlineCount: 7 },
        { date: { year: 2024, month: 6, day: 19 }, onlineCount: 5 },
        { date: { year: 2024, month: 6, day: 20 }, onlineCount: 4 },
        { date: { year: 2024, month: 6, day: 21 }, onlineCount: 3 },
        { date: { year: 2024, month: 6, day: 22 }, onlineCount: 2 },
        { date: { year: 2024, month: 6, day: 23 }, onlineCount: 6 },
        { date: { year: 2024, month: 6, day: 24 }, onlineCount: 5 },
        { date: { year: 2024, month: 6, day: 25 }, onlineCount: 8 },
        { date: { year: 2024, month: 6, day: 26 }, onlineCount: 7 },
      ]);
    }
  }, [range]);

  return (
    <article
      className={`${classes} rounded-md shadow-sm bg-white flex flex-col py-2 px-3 gap-2 justify-between`}
    >
      <header className="flex justify-between w-full items-center">
        <p className="text-lg font-semibold">Student Activity Trend</p>

        <div className="flex gap-2">
          <section className="flex"></section>
          <div className="flex gap-2">
            {["today", "7d", "2w"].map((item) => (
              <button
                key={item}
                onClick={() => setRange(item as Range)}
                className={`px-3 py-1 rounded-md text-sm hover:cursor-pointer ${range === item ? "bg-[var(--secondary-green)]/80 text-black hover:bg-[var(--secondary-green)]" : "bg-gray-100 hover:bg-gray-200"}`}
              >
                {capitalizeWord(item)}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="max-h-[350px] w-full h-full">
        <ResponsiveContainer>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 30 }}
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
      </section>
    </article>
  );
}
