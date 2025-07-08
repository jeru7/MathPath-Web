import { type ReactElement, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AssessmentQuestionChoice } from "../../../../../../core/types/assessment/assessment.types";
import { nanoid } from "nanoid";
import { createPortal } from "react-dom";
import ChoiceItem from "./ChoiceItem";

const dummyChoices: AssessmentQuestionChoice[] = [{ id: "id1", text: "" }];

type ChoicesProps = {
  type: "multiple_choice" | "single_choice";
};

export default function Choices({ type }: ChoicesProps): ReactElement {
  const [choices, setChoices] =
    useState<AssessmentQuestionChoice[]>(dummyChoices);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const handleChoiceTextChange = (id: string, value: string) => {
    setChoices((prev) =>
      prev.map((choice) =>
        choice.id === id ? { ...choice, text: value } : choice,
      ),
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const addChoice = (choice: AssessmentQuestionChoice) => {
    setChoices((prev) => [...prev, choice]);
  };

  const getTaskPos = (id: number | string) => {
    return choices.findIndex((choice) => id === choice.id);
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id === over?.id || !over) return;

    setChoices((choices) => {
      const originalPos = getTaskPos(active.id);
      const newPos = getTaskPos(over?.id);

      return arrayMove(choices, originalPos, newPos);
    });
  };

  return (
    <section className="flex items-start gap-4">
      <label className="font-semibold w-32 min-w-32 text-right">Options</label>
      <section className="border border-gray-300 rounded-sm bg-white w-full h-fit flex flex-col">
        <div className="w-full flex justify-end p-1 bg-gray-100 border-b border-b-gray-300 h-[40px] px-2">
          <div className="flex gap-1 items-center">
            <input type="checkbox" className="hover:cursor-pointer" />
            <p className="text-[10px] font-medium">Randomize position</p>
          </div>
        </div>

        <motion.section
          className="flex flex-col p-2 gap-2 relative overflow-y-auto"
          style={{ maxHeight: "300px" }}
        >
          <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            collisionDetection={closestCorners}
          >
            <SortableContext
              items={choices.map((choice) => choice.id)}
              strategy={verticalListSortingStrategy}
            >
              <AnimatePresence>
                {choices.map((choice) => (
                  <motion.div
                    key={choice.id}
                    layout
                    initial={{ opacity: 0, scale: 1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ChoiceItem
                      choice={choice}
                      onTextChange={handleChoiceTextChange}
                      type={type}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </SortableContext>

            {createPortal(
              <DragOverlay>
                {activeId ? (
                  <ChoiceItem
                    choice={choices.find((c) => c.id === activeId)!}
                    onTextChange={handleChoiceTextChange}
                    dragOverlay
                    type={type}
                  />
                ) : null}
              </DragOverlay>,
              document.body,
            )}
          </DndContext>
          {choices.length !== 4 ? (
            <div className="flex w-full justify-center">
              <button
                type="button"
                onClick={() => addChoice({ id: nanoid(), text: "" })}
                className="rounded-full h-8 w-8 flex items-center justify-center border-gray-400 border hover:cursor-pointer hover:text-black text-[var(--primary-green)] hover:border-[var(--primary-green)] transition-colors duration-200"
              >
                <FaPlus className="w-2 h-2" />
              </button>
            </div>
          ) : null}
        </motion.section>
      </section>
    </section>
  );
}
