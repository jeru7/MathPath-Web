import { useReducer, type ReactElement } from "react";
import { IoClose } from "react-icons/io5";
import QuestionTypeSelect from "./components/QuestionTypeSelect";
import RichTextField from "../../RichTextField";
import Choices from "./choices/Choices";
import Answers from "./components/Answers";
import {
  AssessmentContent,
  AssessmentQuestion,
  AssessmentQuestionChoice,
  FillInTheBlankAnswerType,
  QuestionType,
} from "../../../../../../../core/types/assessment/assessment.types";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import ModalActions from "../ModalActions";
import { getDefaultQuestion, addQuestionReducer } from "./add-question.reducer";
import { useAssessmentBuilder } from "../../../context/assessment-builder.context";

// types
type AddQuestionModalProps = {
  onClose: () => void;
  pageId: string;
  contentToEdit: AssessmentContent | null;
};

// default
export default function AddQuestionModal({
  onClose,
  pageId,
  contentToEdit,
}: AddQuestionModalProps): ReactElement {
  // initial value
  const initial: AssessmentQuestion = contentToEdit
    ? (contentToEdit.data as AssessmentQuestion)
    : getDefaultQuestion("single_choice");

  // reducers
  const { dispatch: assessmentDispatch } = useAssessmentBuilder();
  const [question, questionDispatch] = useReducer(addQuestionReducer, initial);

  // handlers
  const handleTypeChange = (type: QuestionType) => {
    questionDispatch({ type: "SET_TYPE", payload: type });
  };

  const handlePointsChange = (points: number) => {
    questionDispatch({ type: "SET_POINTS", payload: points });
  };

  const handleQuestionContentChange = (text: string) => {
    questionDispatch({ type: "SET_QUESTION", payload: text });
  };

  const handleChoicesChange = (choices: AssessmentQuestionChoice[]) => {
    questionDispatch({ type: "SET_CHOICES", payload: choices });
  };

  const handleAnswersChange = (
    answers: string | string[] | boolean | FillInTheBlankAnswerType[],
  ) => {
    questionDispatch({ type: "SET_ANSWERS", payload: answers });
  };

  const handleToggleRandom = (value: boolean) => {
    questionDispatch({ type: "SET_RANDOM", payload: value });
  };

  const handleAddQuestion = () => {
    if (
      question.question.trim() === "" ||
      question.question.trim().length === 0
    ) {
      toast.error("Question content cannot be empty.");
      return;
    }

    if (question.type === "single_choice") {
      if (question.answers.length !== 1) {
        toast.error("Please select a single correct answer.");
        return;
      }

      if (question.choices.length < 2) {
        toast.error("Please provide at least 2 choices.");
        return;
      }

      let flag: boolean = false;

      question.choices.forEach((choice: AssessmentQuestionChoice) => {
        if (choice.text === "") {
          flag = true;
        }
      });

      if (flag) {
        toast.error("Please provide answers for all choices.");
        return;
      }
    }

    if (question.type === "multiple_choice") {
      if (question.answers.length === 0) {
        toast.error("Please select at least one correct answer.");
        return;
      } else if (question.answers.length === question.choices.length) {
        toast.error("Please leave at least one wrong answer.");
        return;
      }

      let flag: boolean = false;

      question.choices.forEach((choice: AssessmentQuestionChoice) => {
        if (choice.text === "") {
          flag = true;
        }
      });

      if (flag) {
        toast.error("Please provide answers for all choices.");
        return;
      }
    }

    if (question.type === "fill_in_the_blanks") {
      if (question.answers.length < 1) {
        toast.error(
          "Please add at least one blank in your question using [1], [2], etc.",
        );
        return;
      }

      let flag: boolean = false;

      question.answers.forEach((answer: FillInTheBlankAnswerType) => {
        if (answer.value === "") {
          flag = true;
        }
      });

      if (flag) {
        toast.error("Please provide answers for all blanks.");
        return;
      }
    }

    if (question.type === "identification") {
      if ((question.answers as string) === "") {
        toast.error("Please provide an answer.");
        return;
      }
    }

    if (contentToEdit) {
      assessmentDispatch({
        type: "UPDATE_QUESTION",
        payload: {
          pageId,
          contentId: contentToEdit.id,
          question: question,
        },
      });
      console.log("UPDATE_QUESTION");
    } else {
      assessmentDispatch({
        type: "ADD_QUESTION",
        payload: { pageId, question },
      });
      console.log("ADD_QUESTION");
    }

    onClose();
  };

  return (
    <motion.article
      className="w-[800px] h-fit rounded-sm drop-shadow-sm top-1/2 -translate-y-[60%] left-1/2 right-1/2 -translate-x-1/2 absolute bg-white"
      key="add-question-modal"
      initial={{ opacity: 0, scale: 1, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1, y: 50 }}
      transition={{ duration: 0.25 }}
    >
      {/* header */}
      <header className="p-4 bg-inherit rounded-t-sm flex items-center justify-between border-b border-b-gray-300">
        <h3>New Question</h3>
        {/* close button */}
        <button
          className="opacity-80 hover:opacity-100 hover:cursor-pointer transition-all duration-200"
          type="button"
          onClick={onClose}
        >
          <IoClose />
        </button>
      </header>
      <section className="h-full bg-inherit rounded-b-sm p-4">
        <form className="flex flex-col gap-4">
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
                defaultValue={question.points}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  handlePointsChange(isNaN(value) ? 1 : value);
                }}
                min={1}
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
                value={question.question}
                onContentChange={handleQuestionContentChange}
              />
              {/* info for fill in the blanks */}
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
                    Example: The capital of the Philippines is [1] <br />
                    "The capital of the Philippines is _____"
                  </p>
                </motion.div>
              )}
            </div>
          </div>
          {/* divider */}
          <div className="border-b border-b-gray-300 "></div>
          {/* bottom section */}
          <AnimatePresence mode="wait">
            <div className="gap-4 flex flex-col">
              {/* choices for single or multiple choice */}
              {question.type === "single_choice" ||
              question.type === "multiple_choice" ? (
                <motion.div
                  key="choices"
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.25 }}
                >
                  <Choices
                    type={question.type}
                    choices={question.choices}
                    onAnswersChange={handleAnswersChange}
                    onChoicesChange={handleChoicesChange}
                    onToggleRandom={handleToggleRandom}
                    answers={question.answers}
                    isRandom={question.randomPosition}
                  />
                </motion.div>
              ) : (
                // answer fields for the rest of types
                (((question.answers as string[] | FillInTheBlankAnswerType[])
                  .length > 0 &&
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
                      answers={question.answers as FillInTheBlankAnswerType[]}
                      onAnswersChange={handleAnswersChange}
                      type={question.type}
                    />
                  </motion.div>
                )
              )}
              {/* actions */}
              <ModalActions
                onAddContent={handleAddQuestion}
                onCancelClick={onClose}
              />
            </div>
          </AnimatePresence>
        </form>
      </section>
    </motion.article>
  );
}
