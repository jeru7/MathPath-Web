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
import { AssessmentQuestionChoice } from "../../../../../../../../core/types/assessment/assessment.type";
import { nanoid } from "nanoid";
import { createPortal } from "react-dom";
import Choice from "./Choice";

type ChoicesProps = {
  type: "multiple_choice" | "single_choice";
  choices: AssessmentQuestionChoice[];
  onAnswersChange: (answer: string[]) => void;
  onChoicesChange: (choices: AssessmentQuestionChoice[]) => void;
  onToggleRandom: (value: boolean) => void;
  answers: string[];
  isRandom: boolean;
};

export default function Choices({
  type,
  choices,
  onAnswersChange,
  onChoicesChange,
  onToggleRandom,
  answers,
  isRandom,
}: ChoicesProps): ReactElement {
  // states
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  // handlers
  const handleChoiceTextChange = (id: string, value: string) => {
    onChoicesChange(
      choices.map((choice) =>
        choice.id === id ? { ...choice, text: value } : choice,
      ),
    );
  };

  const handleCorrectChange = (choiceId: string, checked: boolean) => {
    if (type === "single_choice") {
      onAnswersChange([choiceId]);
    } else {
      const updatedAnswers = checked
        ? [...answers, choiceId]
        : answers.filter((id) => id !== choiceId);
      onAnswersChange(updatedAnswers);
    }
  };

  const handleAddChoice = (choice: AssessmentQuestionChoice) => {
    onChoicesChange([...choices, choice]);
  };

  const handleDeleteChoice = (choiceId: string) => {
    if (choices.length === 2) return;

    const newChoices: AssessmentQuestionChoice[] = choices.filter(
      (choice) => choice.id !== choiceId,
    );
    const newAnswers = answers.filter((answer) => answer !== choiceId);

    onChoicesChange(newChoices);
    onAnswersChange(newAnswers);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id === over?.id || !over) return;

    const originalPos = getTaskPos(active.id);
    const newPos = getTaskPos(over.id);

    onChoicesChange(arrayMove(choices, originalPos, newPos));
  };

  const getTaskPos = (id: number | string) => {
    return choices.findIndex((choice) => id === choice.id);
  };

  return (
    <section className="flex items-start gap-4">
      <label className="font-semibold w-32 min-w-32 text-right">Options</label>
      <section className="border border-gray-300 rounded-sm bg-white w-full h-fit flex flex-col">
        <div className="w-full flex justify-end p-1 bg-gray-100 border-b border-b-gray-300 h-[40px] px-2">
          {/* random position checkbox */}
          <div className="flex gap-1 items-center">
            <input
              type="checkbox"
              className="hover:cursor-pointer"
              checked={isRandom}
              onChange={(e) => onToggleRandom(e.target.checked)}
            />
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
                    <Choice
                      choice={choice}
                      onTextChange={handleChoiceTextChange}
                      onCorrectChange={handleCorrectChange}
                      type={type}
                      isChecked={answers.includes(choice.id)}
                      onDeleteChoice={handleDeleteChoice}
                      isLastTwo={choices.length === 2}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </SortableContext>

            {createPortal(
              <DragOverlay>
                {activeId
                  ? (() => {
                      const activeChoice = choices.find(
                        (c) => c.id === activeId,
                      );
                      if (!activeChoice) return null;
                      return (
                        <Choice
                          choice={activeChoice}
                          onTextChange={handleChoiceTextChange}
                          onCorrectChange={handleCorrectChange}
                          dragOverlay
                          type={type}
                          isChecked={answers.includes(activeChoice.id)}
                          onDeleteChoice={handleDeleteChoice}
                          isLastTwo={choices.length === 2}
                        />
                      );
                    })()
                  : null}
              </DragOverlay>,
              document.body,
            )}
          </DndContext>
          {choices.length !== 4 ? (
            <div className="flex w-full justify-center">
              <button
                type="button"
                onClick={() => handleAddChoice({ id: nanoid(), text: "" })}
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
