import { format } from "date-fns";
import { forwardRef } from "react";
import { FaCalendar } from "react-icons/fa";
import { Button } from "@/components/ui/button";

type DatetimePickerProps = {
  value?: Date | null;
  onClick?: () => void;
  label: string;
};

const DatetimePicker = forwardRef<HTMLButtonElement, DatetimePickerProps>(
  ({ value, onClick, label }: DatetimePickerProps, ref) => {
    const formatDateForMobile = (date: Date) => {
      if (window.innerWidth < 768) {
        // Mobile format: shorter and more compact
        return `${label} ${format(date, "MMM d, h:mm a")}`;
      } else if (window.innerWidth < 1024) {
        // Tablet format
        return `${label} ${format(date, "MMM d, yyyy 'at' h:mm a")}`;
      } else {
        // Desktop format: full version
        return `${label} ${format(date, "MMMM d, yyyy 'on' h:mm a")}`;
      }
    };

    const formatted = value
      ? formatDateForMobile(value)
      : `Select ${label.toLowerCase()}`;

    return (
      <Button
        type="button"
        variant="outline"
        onClick={onClick}
        ref={ref}
        className="flex items-center gap-2 p-3 sm:p-2 w-full justify-between text-left hover:cursor-pointer h-auto min-h-[44px] sm:min-h-[40px]"
      >
        <span className="text-sm sm:text-xs md:text-sm flex-1 truncate text-start">
          {formatted}
        </span>
        <FaCalendar className="text-muted-foreground flex-shrink-0 w-4 h-4 sm:w-3.5 sm:h-3.5" />
      </Button>
    );
  },
);

DatetimePicker.displayName = "DatetimePicker";

export default DatetimePicker;
