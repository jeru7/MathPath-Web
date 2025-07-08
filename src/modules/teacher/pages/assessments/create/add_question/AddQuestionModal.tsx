import { useState, type ReactElement } from "react";
import { IoClose } from "react-icons/io5";
import QuestionTypeSelect from "./QuestionTypeSelect";
import ActionButtons from "./ActionButtons";
import RichTextField from "./editor/RichTextField";
import Choices from "./choices/Choices";
import Answers from "./Answers";
import {
  AssessmentQuestion,
  AssessmentQuestionChoice,
  FillInTheBlankAnswerType,
  QuestionType,
} from "../../../../../core/types/assessment/assessment.types";
import { nanoid } from "nanoid";
import { AnimatePresence, motion } from "framer-motion";

type AddQuestionModalProps = {
  setShowAddQuestion: (show: boolean) => void;
  onAddQuestion: (question: AssessmentQuestion) => void;
};

export default function AddQuestionModal({
  setShowAddQuestion,
  onAddQuestion,
}: AddQuestionModalProps): ReactElement {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [question, setQuestion] = useState<AssessmentQuestion>({
    question: "",
    type: "single_choice",
    points: 1,
    choices: [],
    answers: [],
  });

  const handleQuestionTextChange = (text: string) => {
    setQuestion((prev) => ({
      ...prev,
      question: text,
    }));
  };

  const handleTypeChange = (newType: QuestionType) => {
    setQuestion(() => {
      if (newType === "single_choice" || newType === "multiple_choice") {
        return {
          type: newType,
          question: "",
          points: 1,
          choices: [],
          answers: [],
        };
      } else if (newType === "fill_in_the_blanks") {
        return {
          type: newType,
          question: "",
          points: 1,
          answers: [],
        };
      } else if (newType === "true_or_false") {
        return {
          type: newType,
          question: "",
          points: 1,
          answers: true,
        };
      } else {
        // identification
        return {
          type: newType,
          question: "",
          points: 1,
          answers: "",
        };
      }
    });
  };

  const handlePointsChange = (newPoints: number) => {
    setQuestion((prev) => ({
      ...prev,
      points: newPoints,
    }));
  };

  const handleChoicesChange = (newChoices: AssessmentQuestionChoice[]) => {
    setQuestion((prev) => ({
      ...prev,
      choices: newChoices,
    }));
  };

  const handleSingleOrMultipleChoiceAnswerChange = (newAnswers: string[]) => {
    setQuestion((prev) =>
      prev.type === "multiple_choice" || prev.type === "single_choice"
        ? { ...prev, answers: newAnswers }
        : prev,
    );
  };

  const handleTrueOrFalseAnswerChange = (answer: boolean) => {
    setQuestion((prev) =>
      prev.type === "true_or_false" ? { ...prev, answers: answer } : prev,
    );
  };

  const handleIdentificationAnswerChange = (answer: string) => {
    setQuestion((prev) =>
      prev.type === "identification" ? { ...prev, answers: answer } : prev,
    );
  };

  const handleFillInTheBlankAnswerChange = (id: string, value: string) => {
    setQuestion((prev) =>
      prev.type === "fill_in_the_blanks"
        ? {
            ...prev,
            answers: (prev.answers as FillInTheBlankAnswerType[]).map(
              (answer) => (answer.id === id ? { ...answer, value } : answer),
            ),
          }
        : prev,
    );
  };
  const handleContentChange = (text: string) => {
    const matches = text.match(/\[(\d+)\]/g) || [];
    const uniqueMatches = Array.from(new Set(matches));

    setQuestion((prev) => {
      if (prev.type !== "fill_in_the_blanks") return prev;

      const existing = new Map(
        (prev.answers as FillInTheBlankAnswerType[]).map((p) => [p.label, p]),
      );

      const updatedAnswers = uniqueMatches
        .map((label) => {
          const number = label.match(/^\[(\d+)\]$/)?.[1];
          if (!number) return null;

          const existingLabel = existing.get(number);
          return existingLabel
            ? existingLabel
            : {
                id: nanoid(),
                label: number.toString(),
                value: "",
              };
        })
        .filter(Boolean) as FillInTheBlankAnswerType[];

      return {
        ...prev,
        answers: updatedAnswers,
      };
    });
  };

  const handleClose = () => setIsVisible(false);

  const handleAddQuestion = () => {
    onAddQuestion(question);
    handleClose();
  };

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => setShowAddQuestion(false)}
    >
      {isVisible && (
        <div className="fixed w-screen h-screen bg-black/20 z-50 top-0 left-0">
          <div className="w-full h-full relative">
            <motion.article
              className="w-[800px] h-fit rounded-sm drop-shadow-sm top-1/2 -translate-y-[60%] left-1/2 right-1/2 -translate-x-1/2 absolute"
              key="add-question-modal"
              initial={{ opacity: 0, scale: 1, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1, y: 50 }}
              transition={{ duration: 0.25 }}
            >
              <header className="p-4 bg-white rounded-t-sm flex items-center justify-between border-b border-b-gray-300">
                <h3>New Question</h3>
                <button
                  className="opacity-80 hover:opacity-100 hover:cursor-pointer transition-all duration-200"
                  type="button"
                  onClick={handleClose}
                >
                  <IoClose />
                </button>
              </header>
              <section className="h-full bg-white rounded-b-sm p-4">
                <form action="" className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    {/* Question type */}
                    <div className="flex items-center gap-4">
                      <label
                        htmlFor="type"
                        className="font-semibold w-32 min-w-32 text-right"
                      >
                        Question Type
                      </label>
                      <QuestionTypeSelect onTypeChange={handleTypeChange} />
                    </div>

                    {/* Points */}
                    <div className="flex gap-4 items-center">
                      <label htmlFor="points" className="font-semibold">
                        Points
                      </label>
                      <input
                        id="points"
                        type="number"
                        className="border border-gray-300 text-center rounded-sm px-2 py-1 w-24 focus:outline-none focus:ring-1 focus:ring-green-400"
                        defaultValue={1}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          handlePointsChange(isNaN(value) ? 1 : value);
                        }}
                        min={0}
                        max={100}
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    {/* Question Field */}
                    <label
                      htmlFor="question"
                      className="font-semibold w-32 min-w-32 text-right"
                    >
                      Question
                    </label>
                    <div className="flex flex-col w-full gap-2">
                      <RichTextField
                        key={question.type}
                        onContentChange={handleContentChange}
                        questionData={question}
                      />
                      {question.type === "fill_in_the_blanks" && (
                        <motion.div
                          className="p-2 bg-[var(--primary-yellow)]/80"
                          key="info"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.25 }}
                        >
                          <p className="italic text-right text-xs">
                            Use brackets to indicate blanks. <br />
                            Example: The capital of the Philippines is [1]{" "}
                            <br />
                            "The capital of the Philippines is _____"
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <div className="border-b border-b-gray-300 "></div>
                  <AnimatePresence mode="wait">
                    <div className="gap-4 flex flex-col">
                      {question.type === "single_choice" ||
                      question.type === "multiple_choice" ? (
                        <motion.div
                          key="choices"
                          initial={{ opacity: 0, scale: 1 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.25 }}
                        >
                          <Choices type={question.type} />
                        </motion.div>
                      ) : (
                        (((
                          question.answers as
                            | string[]
                            | FillInTheBlankAnswerType[]
                        ).length > 0 &&
                          question.type === "fill_in_the_blanks") ||
                          question.type === "identification" ||
                          question.type === "true_or_false") && (
                          <motion.div
                            key="answers"
                            initial={{ opacity: 0, scale: 1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.25 }}
                          >
                            <Answers
                              answers={
                                question.answers as FillInTheBlankAnswerType[]
                              }
                              type={question.type}
                            />
                          </motion.div>
                        )
                      )}
                      {/* Action Buttons */}
                      <ActionButtons onAddQuestion={handleAddQuestion} />
                    </div>
                  </AnimatePresence>
                </form>
              </section>
            </motion.article>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
