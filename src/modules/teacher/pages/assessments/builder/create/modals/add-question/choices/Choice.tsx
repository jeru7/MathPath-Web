import { type ReactElement } from "react";
import { IoClose } from "react-icons/io5";
import { MdOutlineDragIndicator } from "react-icons/md";
import { useSortable } from "@dnd-kit/sortable";
import { AssessmentQuestionChoice } from "../../../../../../../../core/types/assessment/assessment.type";
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
  // dnd methods
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
      className={`w-full bg-white dark:bg-gray-700 rounded-xs flex gap-2 font-primary border border-gray-200 dark:border-gray-600 p-2 ${isDragging ? "opacity-50" : ""} transition-colors duration-200`}
      ref={setNodeRef}
      {...attributes}
      style={style}
    >
      {/* drag indicator */}
      <div
        className="hover:cursor-grab active:cursor-grabbing flex items-center justify-center text-gray-600 dark:text-gray-400"
        {...(!dragOverlay ? listeners : {})}
      >
        <MdOutlineDragIndicator />
      </div>
      {/* text input */}
      <div
        className={`bg-white dark:bg-gray-600 border rounded-xs p-2 w-full ${isEmpty ? "border-red-500" : "border-gray-300 dark:border-gray-500"} transition-colors duration-200`}
      >
        <input
          type="text"
          placeholder="Type option here..."
          className="text-sm focus:outline-none w-full bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
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
          <label
            htmlFor="choices"
            className="text-xs text-gray-700 dark:text-gray-300 transition-colors duration-200"
          >
            Correct
          </label>
        </section>
        {/* delete button */}
        <button
          className={`text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white ${isLastTwo ? "opacity-0" : "hover:cursor-pointer"} transition-colors duration-200`}
          type="button"
          onClick={() => onDeleteChoice(choice.id)}
        >
          <IoClose />
        </button>
      </div>
    </article>
  );
}
