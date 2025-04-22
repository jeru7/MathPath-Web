import { type ReactElement } from "react";
import { IStudent } from "../../../../types/student.type";

export interface IPrimaryStatProps {
  color: string;
  title: "Total Students" | "Online Students" | "Average Level";
  students?: IStudent[];
  onlineStudents?: IStudent[];
}

export default function PrimaryStat({
  color,
  title,
  students,
  onlineStudents,
}: IPrimaryStatProps): ReactElement {

  const averageLevel = () => {
    if (!students || students.length === 0) return 0;
    const totalLevel = students?.reduce((sum, student) => sum + student.level, 0)
    const average = totalLevel / students.length;
    return parseFloat(average.toFixed(1));
  }

  return (
    <div className="flex w-full rounded-sm bg-[var(--primary-white)] px-16 py-8 drop-shadow-sm">
      <div className="flex w-full flex-col">
        <p className="font-semibold text-[var(--primary-gray)]">
          {title}
        </p>
        <p className="text-4xl font-bold">{title === "Total Students" ?
          students?.length
          : title === "Online Students"
            ? onlineStudents?.length
            : averageLevel()}</p>
      </div>
      <div className="flex w-full items-center justify-center">CHART</div>
    </div>
  );
}
