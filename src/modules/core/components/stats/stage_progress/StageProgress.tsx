import { type ReactElement } from "react";
import {
  AreaChart,
  Area,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
  XAxis,
} from "recharts";

interface IStageProgressProps {
  classes: string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-300 rounded shadow text-sm">
        <p className="font-medium">Stage: {label}</p>
        <p>Completed: {payload[0].value}</p>
      </div>
    );
  }

  return null;
};

export default function StageProgress({
  classes,
}: IStageProgressProps): ReactElement {
  const dummyData = Array.from({ length: 45 }, (_, i) => ({
    stage: i + 1,
    completedCount: Math.floor(Math.random() * 20),
  }));

  return (
    <article
      className={`${classes} rounded-md shadow-sm bg-white flex flex-col p-2 gap-2 justify-between`}
    >
      <header className="mb-2">
        <p className="text-lg font-semibold">Stage Progress</p>
      </header>

      <div className="w-full h-full max-h-[320px]">
        <ResponsiveContainer>
          <AreaChart
            data={dummyData}
            margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
          >
            <YAxis allowDecimals={false} tick={{ dx: -10 }} />
            <XAxis dataKey="stage" interval={1} tick={{ dy: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="completedCount"
              stroke="#4ade80"
              fill="#bbf7d0"
              animationDuration={800}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
