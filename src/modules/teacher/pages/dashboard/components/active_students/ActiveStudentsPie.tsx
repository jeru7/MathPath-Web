import { type ReactElement } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { customLabel } from "./CustomLabel";
import { ActiveStudentsSections } from "../../../../types/active-student.type";

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
  const validChartData =
    chartData && chartData.length > 0
      ? chartData
      : [{ name: "No Data", percentage: 100 }];
  const validSectionColors =
    sectionColors && sectionColors.length > 0 ? sectionColors : ["#a9a9a9"];

  const totalPercent = validChartData.reduce(
    (sum, item) => sum + (item.percentage || 0),
    0,
  );
  const normalizedData = totalPercent !== 100 ? validChartData : validChartData;

  return (
    <section className={`${classes} flex items-center justify-center relative`}>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={normalizedData}
            dataKey="percentage"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={70}
            innerRadius={40}
            startAngle={90}
            endAngle={-270}
            paddingAngle={1}
            label={customLabel}
            labelLine={false}
            isAnimationActive={true}
          >
            {normalizedData.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={validSectionColors[index % validSectionColors.length]}
                stroke="hsl(var(--background))"
                strokeWidth={2}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute text-center pointer-events-none">
        <p className="text-2xl font-bold text-foreground">{totalPercentage}%</p>
        <p className="text-xs text-muted-foreground">Active</p>
      </div>
    </section>
  );
}
