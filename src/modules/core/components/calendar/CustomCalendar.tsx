import { type ReactElement } from "react";
import "react-calendar/dist/Calendar.css";
import "../../styles/customCalendar.css";
import { Calendar } from "react-calendar";

export default function CustomCalendar(): ReactElement {
  return (
    <article className="w-full h-fit rounded-md bg-white drop-shadow-sm p-4 flex flex-col gap-8">
      <Calendar showFixedNumberOfWeeks={true} />
    </article>
  );
}
