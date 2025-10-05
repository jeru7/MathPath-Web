import { type ReactElement } from "react";
import { DifficultyFrequency } from "../../../types/student-stats.type";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

type DifficultyFrequencyProps = {
  data: DifficultyFrequency | undefined;
};
export default function DifficultyFrequencyCard({
  data,
}: DifficultyFrequencyProps): ReactElement {
  const difficultyFrequencyData = getDifficultyFrequency(data);
  return (
    <section className="flex flex-col p-4 items-center rounded-sm bg-white shadow-sm relative">
      <header>
        <p className="font-semibold">Chosen difficulty frequency</p>
      </header>
      <ResponsiveContainer className="w-full h-full min-h-[200px] min-w-[200px]">
        <RadarChart
          cx="50%"
          cy="60%"
          outerRadius="80%"
          data={difficultyFrequencyData}
        >
          <PolarGrid />
          <PolarAngleAxis dataKey="frequency" />
          <Radar
            dataKey="value"
            stroke="#f09319"
            fill="#ffa725"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-2 w-full text-gray-400 text-xs absolute bottom-6">
        <p>Easy: {difficultyFrequencyData[0].value}%</p>
        <p>Medium: {difficultyFrequencyData[1].value}%</p>
        <p>Hard: {difficultyFrequencyData[2].value}%</p>
      </div>
    </section>
  );
}

const getDifficultyFrequency = (data: DifficultyFrequency | undefined) => {
  if (!data) {
    return (["easy", "medium", "hard"] as const).map((level) => ({
      frequency: level,
      value: 0,
    }));
  }

  return (["easy", "medium", "hard"] as const).map((level) => ({
    frequency: level,
    value: data[level].percentage,
  }));
};
