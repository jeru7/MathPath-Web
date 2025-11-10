import { type ReactElement } from "react";
import { IoClose } from "react-icons/io5";
import { MdOutlineDragIndicator } from "react-icons/md";
import { useSortable } from "@dnd-kit/sortable";
import { AssessmentQuestionChoice } from "../../../../../../../../core/types/assessment/assessment.type";
import { CSS } from "@dnd-kit/utilities";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ChoiceProps = {
  choice: AssessmentQuestionChoice;
  type: "multiple_choice" | "single_choice";
  onTextChange: (id: string, value: string) => void;
  onCorrectChange: (choiceId: string, checked: boolean) => void;
  dragOverlay?: boolean;
  isChecked: boolean;
  onDeleteChoice: (choiceId: string) => void;
  isLastTwo: boolean;
  isEmpty: boolean;
};

export default function Choice({
  choice,
  onTextChange,
  onCorrectChange,
  dragOverlay,
  type,
  isChecked,
  onDeleteChoice,
  isLastTwo,
  isEmpty,
}: ChoiceProps): ReactElement {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: choice.id,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const handleRadioChange = (value: string) => {
    onCorrectChange(choice.id, value === choice.id);
  };

  const handleCheckboxChange = (checked: boolean) => {
    onCorrectChange(choice.id, checked);
  };

  return (
    <div
      className={cn(
        "w-full bg-card rounded-lg border p-3 flex items-center gap-3",
        isEmpty && "border-destructive",
        isDragging && "opacity-50",
      )}
      ref={setNodeRef}
      {...attributes}
      style={style}
    >
      <div
        className="flex items-center justify-center text-muted-foreground cursor-grab active:cursor-grabbing"
        {...(!dragOverlay ? listeners : {})}
      >
        <MdOutlineDragIndicator className="w-4 h-4" />
      </div>

      <Input
        type="text"
        placeholder="Type option here..."
        className={cn(
          "flex-1",
          isEmpty && "border-destructive focus-visible:ring-destructive",
        )}
        value={choice.text}
        onChange={(e) => onTextChange(choice.id, e.target.value)}
      />

      <div className="flex items-center gap-3">
        {type === "single_choice" ? (
          <RadioGroup
            value={isChecked ? choice.id : ""}
            onValueChange={handleRadioChange}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={choice.id} id={choice.id} />
              <label
                htmlFor={choice.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Correct
              </label>
            </div>
          </RadioGroup>
        ) : (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={choice.id}
              checked={isChecked}
              onCheckedChange={handleCheckboxChange}
            />
            <label
              htmlFor={choice.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Correct
            </label>
          </div>
        )}

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 text-muted-foreground hover:text-destructive",
            isLastTwo && "opacity-0 pointer-events-none",
          )}
          onClick={() => onDeleteChoice(choice.id)}
        >
          <IoClose className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
