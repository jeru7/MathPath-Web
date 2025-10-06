import { type ReactElement } from "react";
import "react-calendar/dist/Calendar.css";
import "../../styles/customCalendar.css";
import { Calendar } from "react-calendar";

type CustomCalendarProps = {
  classes?: string;
};

export default function CustomCalendar({
  classes,
}: CustomCalendarProps): ReactElement {
  return (
    <article
      className={`${classes} w-full rounded-sm bg-gray-50 border border-white dark:bg-gray-800 dark:border-gray-700 shadow-sm p-2 flex flex-col gap-8 items-center transition-colors duration-200`}
    >
      <div className="h-full w-full">
        <Calendar showFixedNumberOfWeeks={true} />
      </div>
    </article>
  );
}
