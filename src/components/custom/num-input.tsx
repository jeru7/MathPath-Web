import { FaChevronUp } from "react-icons/fa";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FaChevronDown } from "react-icons/fa6";
import { cn } from "@/lib/utils";

export const NumberInputWithControls = ({
  id,
  value,
  min,
  max,
  onChange,
  disabled = false,
  className,
}: {
  id: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
}) => (
  <div className={cn("relative flex flex-col gap-1", className)}>
    <div className="flex items-center gap-1">
      <Input
        id={id}
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-20 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <div className="absolute flex flex-col -right-8">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange(Math.min(value + 1, max))}
          disabled={disabled || value >= max}
          className="h-6 w-6 p-0 rounded-b-none border-b-0"
        >
          <FaChevronUp className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange(Math.max(value - 1, min))}
          disabled={disabled || value <= min}
          className="h-6 w-6 p-0 rounded-t-none"
        >
          <FaChevronDown className="h-3 w-3" />
        </Button>
      </div>
    </div>
  </div>
);
