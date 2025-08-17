import { format } from "date-fns";
import { forwardRef } from "react";
import { FaCalendar } from "react-icons/fa";

type DatetimePickerProps = {
  value?: Date | null;
  onClick?: () => void;
  label: string;
};

const DatetimePicker = forwardRef<HTMLButtonElement, DatetimePickerProps>(
  ({ value, onClick, label }: DatetimePickerProps, ref) => {
    const formatted = value
      ? `${label} ${format(value, "MMMM d, yyyy 'on' h:mm a")}`
      : `Select ${label.toLowerCase()}`;

    return (
      <button
        type="button"
        onClick={onClick}
        ref={ref}
        className="flex items-center gap-2 border border-gray-300 p-2 rounded-sm w-full justify-between bg-white hover:bg-gray-100 transition text-left hover:cursor-pointer"
      >
        <span className="text-xs md:text-sm text-gray-700">{formatted}</span>
        <FaCalendar className="text-gray-500" />
      </button>
    );
  },
);

export default DatetimePicker;
