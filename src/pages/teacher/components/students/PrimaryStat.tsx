import { type ReactElement } from "react";


export interface IPrimaryStatProps {
  color: string;
  title: "Total Students" | "Online Students" | "Average Level";
  totalStudents?: number;
  onlineStudents?: number;
  averageLevel?: number;
}

export default function PrimaryStat({
  color,
  title,
  totalStudents,
  onlineStudents,
  averageLevel,
}: IPrimaryStatProps): ReactElement {
  return (
    <div className="flex w-full rounded-sm bg-[var(--primary-white)] px-16 py-8 drop-shadow-sm">
      <div className="flex w-full flex-col">
        <p className="font-semibold text-[var(--primary-gray)]">
          {title}
        </p>
        <p className="text-4xl font-bold">{title === "Total Students" ?
          totalStudents
          : title === "Online Students"
            ? onlineStudents
            : averageLevel}</p>
      </div>
      <div className="flex w-full items-center justify-center">CHART</div>
    </div>
  );
}
