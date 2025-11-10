import { type ReactElement } from "react";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type AnswerFieldProps = {
  label?: string;
  type: "text" | "radio";
  name?: string;
  value: string | boolean;
  onChange: (value: string | boolean) => void;
  checked?: boolean;
  radioLabel?: "True" | "False";
  isEmpty?: boolean;
};

export default function AnswerField({
  label,
  type,
  value,
  name,
  onChange,
  checked,
  isEmpty,
}: AnswerFieldProps): ReactElement {
  const handleRadioChange = (newValue: string) => {
    if (newValue === "true") {
      onChange(true);
    } else if (newValue === "false") {
      onChange(false);
    }
  };

  if (type === "text") {
    return (
      <div className="flex items-center gap-2">
        {label && (
          <div className="px-3 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm min-w-12 text-center">
            {label}
          </div>
        )}
        <Input
          type="text"
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "flex-1",
            isEmpty && "border-destructive focus-visible:ring-destructive",
          )}
          placeholder="Type answer here..."
        />
      </div>
    );
  }

  return (
    <RadioGroup
      value={checked ? (value === true ? "true" : "false") : ""}
      onValueChange={handleRadioChange}
      className="flex gap-4"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="true" id={`${name}-true`} className="sr-only" />
        <Label
          htmlFor={`${name}-true`}
          className={cn(
            "px-4 py-2 border rounded-md cursor-pointer transition-colors select-none",
            value === true
              ? "bg-green-600 text-white border-green-600"
              : "border-input hover:bg-green-600/50 hover:text-accent-foreground",
          )}
        >
          True
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem
          value="false"
          id={`${name}-false`}
          className="sr-only"
        />
        <Label
          htmlFor={`${name}-false`}
          className={cn(
            "px-4 py-2 border rounded-md cursor-pointer transition-colors select-none",
            value === false
              ? "bg-red-600 text-white border-red-600"
              : "border-input hover:bg-red-600/50 hover:text-accent-foreground",
          )}
        >
          False
        </Label>
      </div>
    </RadioGroup>
  );
}
