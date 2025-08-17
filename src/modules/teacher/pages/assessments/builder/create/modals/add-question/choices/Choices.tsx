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
import {
  AssessmentQuestion,
  AssessmentQuestionChoice,
} from "../../../../../../../../core/types/assessment/assessment.type";
import { nanoid } from "nanoid";
import { createPortal } from "react-dom";
import Choice from "./Choice";

type ChoicesProps = {
  isValidated: boolean;
  question: AssessmentQuestion;
  onAnswersChange: (answer: string[]) => void;
  onChoicesChange: (choices: AssessmentQuestionChoice[]) => void;
  onToggleRandom: (value: boolean) => void;
  errors: { [key: string]: string | number[] };
};

export default function Choices({
  isValidated,
  question,
  onAnswersChange,
  onChoicesChange,
  onToggleRandom,
  errors,
}: ChoicesProps): ReactElement {
  // states
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const isSingleOrMulti =
    question.type === "single_choice" || question.type === "multiple_choice";
  const choices = isSingleOrMulti ? question.choices : [];
  const answers = isSingleOrMulti ? question.answers : [];

  // handlers
  const handleChoiceTextChange = (id: string, value: string) => {
    onChoicesChange(
      choices.map((choice: AssessmentQuestionChoice) =>
        choice.id === id ? { ...choice, text: value } : choice,
      ),
    );
  };

  const handleCorrectChange = (choiceId: string, checked: boolean) => {
    if (question.type === "single_choice") {
      onAnswersChange([choiceId]);
    } else {
      const updatedAnswers = checked
        ? [...(question.answers as string[]), choiceId]
        : (question.answers as string[]).filter((id) => id !== choiceId);
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
    if (!isSingleOrMulti) return;

    const { active, over } = event;
    if (active.id === over?.id || !over) return;

    const originalPos = getTaskPos(active.id);
    const newPos = getTaskPos(over.id);

    onChoicesChange(
      arrayMove(question.choices, originalPos as number, newPos as number),
    );
  };

  const getTaskPos = (id: number | string) => {
    if (!isSingleOrMulti) return;
    return question.choices.findIndex((choice) => id === choice.id);
  };

  return (
    <section className="flex flex-col gap-2 md:flex-row md:items-start md:gap-4">
      <label className="text-sm md:text-base font-semibold w-32 min-w-32 md:text-right">
        Options
      </label>
      <div className="flex flex-col gap-1 w-full">
        <section className="border border-gray-300 rounded-sm bg-white w-full h-fit flex flex-col">
          <div className="w-full flex justify-end items-center p-1 bg-gray-100 border-b border-b-gray-300 h-[40px] px-2">
            {/* random position checkbox */}
            <div className="flex gap-1 items-center">
              <input
                type="checkbox"
                className="hover:cursor-pointer"
                checked={isSingleOrMulti && question.randomPosition}
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
                  {choices.map((choice, index) => (
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
                        type={
                          (question.type as "single_choice") ||
                          "multiple_choice"
                        }
                        isChecked={answers.includes(choice.id)}
                        onDeleteChoice={handleDeleteChoice}
                        isLastTwo={choices.length === 2}
                        isEmpty={
                          isValidated &&
                          (errors.choices as number[])?.includes(index)
                        }
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
                            type={
                              (question.type as "single_choice") ||
                              "multiple_choice"
                            }
                            isChecked={answers.includes(activeChoice.id)}
                            onDeleteChoice={handleDeleteChoice}
                            isLastTwo={choices.length === 2}
                            isEmpty={false}
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
        <AnimatePresence mode="wait">
          {isValidated && errors.answer && (
            <motion.p
              key="error-answer"
              className="text-xs md:text-sm text-red-500 self-end"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5, transition: { duration: 0.1 } }}
            >
              {errors.answer}
            </motion.p>
          )}
          {isValidated && errors.multiChoiceAnswer && (
            <motion.p
              key="error-multiChoice"
              className="text-xs md:text-sm text-red-500 self-end"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5, transition: { duration: 0.1 } }}
            >
              {errors.multiChoiceAnswer}
            </motion.p>
          )}
          {isValidated &&
            !errors.answer &&
            !errors.multiChoiceAnswer &&
            errors.duplicateChoices && (
              <motion.p
                key="error-duplicateChoices"
                className="text-sm text-red-500 self-end"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5, transition: { duration: 0.1 } }}
              >
                {errors.duplicateChoices}
              </motion.p>
            )}
        </AnimatePresence>
      </div>
    </section>
  );
}
