import { type ReactElement } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { ActiveStudentsSections } from "../../../../types/stats/active_students/active_student.types";
import { customLabel } from "./CustomLabel";

interface IActiveStudentsPieProps {
  classes: string;
  chartData: ActiveStudentsSections[];
  totalPercentage: number;
  sectionColors: string[];
}

export default function ActiveStudentsPie({
  classes,
  chartData,
  totalPercentage,
  sectionColors,
}: IActiveStudentsPieProps): ReactElement {
  return (
    <section className={`${classes} flex items-center justify-center`}>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="percentage"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={50}
            startAngle={90}
            endAngle={-270}
            paddingAngle={2}
            label={customLabel}
            labelLine={false}
          >
            {chartData.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={sectionColors[index % sectionColors.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute text-center">
        <p className="text-2xl font-bold">{totalPercentage}%</p>
        <p className="text-xs text-gray-500">Active</p>
      </div>
    </section>
  );
}
