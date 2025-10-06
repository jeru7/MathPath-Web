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
        className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 p-2 rounded-sm w-full justify-between bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 text-left hover:cursor-pointer"
      >
        <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">
          {formatted}
        </span>
        <FaCalendar className="text-gray-500 dark:text-gray-400" />
      </button>
    );
  },
);

export default DatetimePicker;
