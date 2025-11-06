import { type ReactElement } from "react";
import "react-calendar/dist/Calendar.css";
import "../../styles/customCalendar.css";
import { Calendar } from "react-calendar";
import { Card, CardContent } from "@/components/ui/card";

type CustomCalendarProps = {
  classes?: string;
};

export default function CustomCalendar({
  classes,
}: CustomCalendarProps): ReactElement {
  return (
    <Card className={`${classes} w-full p-2`}>
      <CardContent className="p-0">
        <div className="h-full w-full">
          <Calendar showFixedNumberOfWeeks={true} />
        </div>
      </CardContent>
    </Card>
  );
}
