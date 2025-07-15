import { type ReactElement } from "react";
import { IoClose } from "react-icons/io5";
import { MdOutlineDragIndicator } from "react-icons/md";
import { useSortable } from "@dnd-kit/sortable";
import { AssessmentQuestionChoice } from "../../../../../../core/types/assessment/assessment.types";
import { CSS } from "@dnd-kit/utilities";

type ChoiceProps = {
  choice: AssessmentQuestionChoice;
  type: "multiple_choice" | "single_choice";
  onTextChange: (id: string, value: string) => void;
  onCorrectChange: (choiceId: string, checked: boolean) => void;
  dragOverlay?: boolean;
  isChecked: boolean;
  onDeleteChoice: (choiceId: string) => void;
  isLastTwo: boolean;
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

  return (
    <article
      className={`w-full bg-white rounded-xs flex gap-2 font-primary border border-gray-200 p-2 ${isDragging ? "opacity-50" : ""}`}
      ref={setNodeRef}
      {...attributes}
      style={style}
    >
      {/* drag indicator */}
      <div
        className="hover:cursor-grab active:cursor-grabbing flex items-center justify-center"
        {...(!dragOverlay ? listeners : {})}
      >
        <MdOutlineDragIndicator />
      </div>
      {/* text input */}
      <div className="bg-white border rounded-xs border-gray-300 p-2 w-full">
        <input
          type="text"
          placeholder="Type option here..."
          className="text-sm focus:outline-none w-full"
          value={choice.text}
          onChange={(e) => onTextChange(choice.id, e.target.value)}
        />
      </div>
      {/* checkbox or radio button */}
      <div className="flex gap-2">
        <section className="flex gap-1 items-center">
          <input
            type={type === "single_choice" ? "radio" : "checkbox"}
            name="choices"
            className="hover:cursor-pointer"
            checked={isChecked}
            onChange={(e) => onCorrectChange(choice.id, e.target.checked)}
          />
          <label htmlFor="choices" className="text-xs">
            Correct
          </label>
        </section>
        {/* delete button */}
        <button
          className={`text-gray-400 hover:text-black ${isLastTwo ? "opacity-0" : "hover:cursor-pointer"}`}
          type="button"
          onClick={() => onDeleteChoice(choice.id)}
        >
          <IoClose />
        </button>
      </div>
    </article>
  );
}
