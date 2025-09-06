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
      className={`${classes} w-full rounded-sm bg-white shadow-sm p-4 flex flex-col gap-8 items-center`}
    >
      <div className="h-full w-full">
        <Calendar showFixedNumberOfWeeks={true} />
      </div>
    </article>
  );
}
