import { type ReactElement } from "react";
import { IoClose } from "react-icons/io5";
import { MdOutlineDragIndicator } from "react-icons/md";
import { useSortable } from "@dnd-kit/sortable";
import { AssessmentQuestionChoice } from "../../../../../../core/types/assessment/assessment.types";
import { CSS } from "@dnd-kit/utilities";

type ChoiceItemProps = {
  choice: AssessmentQuestionChoice;
  type: "multiple_choice" | "single_choice";
  onTextChange: (id: string, value: string) => void;
  dragOverlay?: boolean;
};

export default function ChoiceItem({
  choice,
  onTextChange,
  dragOverlay,
  type,
}: ChoiceItemProps): ReactElement {
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
      <button
        className="hover:cursor-grab active:cursor-grabbing"
        type="button"
        {...(!dragOverlay ? listeners : {})}
      >
        <MdOutlineDragIndicator />
      </button>
      <div className="bg-white border rounded-xs border-gray-300 p-2 w-full">
        <input
          type="text"
          placeholder="Type option here..."
          className="text-sm focus:outline-none w-full"
          value={choice.text}
          onChange={(e) => onTextChange(choice.id, e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <section className="flex gap-1 items-center">
          <input
            type={type === "single_choice" ? "radio" : "checkbox"}
            name="choices"
            className="hover:cursor-pointer"
          />
          <label htmlFor="choices" className="text-xs">
            Correct
          </label>
        </section>
        <button
          className="hover:cursor-pointer text-gray-400 hover:text-black"
          type="button"
        >
          <IoClose />
        </button>
      </div>
    </article>
  );
}
