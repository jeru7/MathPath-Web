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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const isSingleOrMulti =
    question.type === "single_choice" || question.type === "multiple_choice";
  const choices = isSingleOrMulti ? question.choices : [];
  const answers = isSingleOrMulti ? question.answers : [];

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

  const handleToggleRandomChange = (checked: boolean) => {
    onToggleRandom(checked);
  };

  return (
    <div className="flex flex-col gap-4">
      <Label className="text-sm font-medium">Options</Label>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium">Choices</Label>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isSingleOrMulti && question.randomPosition}
                onCheckedChange={handleToggleRandomChange}
              />
              <Label className="text-sm font-normal">Randomize position</Label>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
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
                        (question.type as "single_choice") || "multiple_choice"
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

          {choices.length < 4 && (
            <div className="flex justify-center pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddChoice({ id: nanoid(), text: "" })}
                className="h-8 w-8 p-0 rounded-full"
              >
                <FaPlus className="w-3 h-3" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {isValidated && errors.answer && (
          <motion.p
            key="error-answer"
            className="text-xs text-destructive"
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
            className="text-xs text-destructive"
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
              className="text-sm text-destructive"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5, transition: { duration: 0.1 } }}
            >
              {errors.duplicateChoices}
            </motion.p>
          )}
      </AnimatePresence>
    </div>
  );
}
