import { useState, type ReactElement } from "react";
import { QuestionType } from "../../../../../../../../core/types/assessment/assessment.type";
import { getCustomSelectColor } from "../../../../../../../../core/styles/selectStyles";
import Select from "react-select";

type QuestionTypeSelectProps = {
  onTypeChange: (newType: QuestionType) => void;
  classes: string;
};

export default function QuestionTypeSelect({
  onTypeChange,
  classes,
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
        backgroundColor: "white",
        textColor: "#1f2937",
        menuBackgroundColor: "white",
        menuMinWidth: "100%",
        dark: {
          backgroundColor: "#374151",
          textColor: "#f9fafb",
          borderColor: "#4b5563",
          borderFocusColor: "#10b981",
          optionHoverColor: "#1f2937",
          optionSelectedColor: "#059669",
          menuBackgroundColor: "#374151",
          placeholderColor: "#9ca3af",
        },
      })}
      isSearchable={false}
      className={classes}
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
