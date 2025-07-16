import { useState, type ReactElement } from "react";
import { QuestionType } from "../../../../../../../../core/types/assessment/assessment.types";
import { getCustomSelectColor } from "../../../../../../../../core/styles/selectStyles";
import Select from "react-select";

type QuestionTypeSelectProps = {
  onTypeChange: (newType: QuestionType) => void;
};

export default function QuestionTypeSelect({
  onTypeChange,
}: QuestionTypeSelectProps): ReactElement {
  const [selectedType, setSelectedType] = useState<QuestionTypeOption | null>({
    value: "single_choice",
    label: "Single Choice",
  });

  return (
    <Select<QuestionTypeOption>
      id="type"
      options={questionTypeOptions}
      value={selectedType}
      onChange={(e) => {
        if (e) {
          setSelectedType(e);
          onTypeChange(e.value);
        }
      }}
      placeholder="Select type"
      styles={getCustomSelectColor({
        borderRadius: "var(--radius-sm)",
        justifyContent: "flex-start",
      })}
      isSearchable={false}
      className="w-48"
    />
  );
}

type QuestionTypeOption = {
  value: QuestionType;
  label: string;
};

const questionTypeOptions: { value: QuestionType; label: string }[] = [
  { value: "single_choice", label: "Single Choice" },
  { value: "multiple_choice", label: "Multiple Choice" },
  { value: "identification", label: "Identification" },
  { value: "true_or_false", label: "True or False" },
  { value: "fill_in_the_blanks", label: "Fill in the blanks" },
];
