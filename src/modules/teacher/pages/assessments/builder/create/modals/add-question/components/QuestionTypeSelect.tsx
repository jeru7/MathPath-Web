import { type ReactElement } from "react";
import { QuestionType } from "../../../../../../../../core/types/assessment/assessment.type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type QuestionTypeSelectProps = {
  onTypeChange: (newType: QuestionType) => void;
  defaultValue?: QuestionType;
  className?: string;
};

export default function QuestionTypeSelect({
  onTypeChange,
  defaultValue = "single_choice",
  className,
}: QuestionTypeSelectProps): ReactElement {
  const getTypeLabel = (type: QuestionType): string => {
    const option = questionTypeOptions.find((opt) => opt.value === type);
    return option?.label || "Select type";
  };

  return (
    <Select defaultValue={defaultValue} onValueChange={onTypeChange}>
      <SelectTrigger className={className}>
        <SelectValue>{getTypeLabel(defaultValue)}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {questionTypeOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

type QuestionTypeOption = {
  value: QuestionType;
  label: string;
};

const questionTypeOptions: QuestionTypeOption[] = [
  { value: "single_choice", label: "Single Choice" },
  { value: "multiple_choice", label: "Multiple Choice" },
  { value: "identification", label: "Identification" },
  { value: "true_or_false", label: "True or False" },
  { value: "fill_in_the_blanks", label: "Fill in the blanks" },
];
