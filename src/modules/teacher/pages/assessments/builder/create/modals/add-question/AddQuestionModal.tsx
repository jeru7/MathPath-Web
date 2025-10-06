import { useReducer, useState, type ReactElement } from "react";
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
} from "../../../../../../../core/types/assessment/assessment.type";
import { AnimatePresence, motion } from "framer-motion";
import ModalActions from "../ModalActions";
import { getDefaultQuestion, addQuestionReducer } from "./add-question.reducer";
import { useAssessmentBuilder } from "../../../context/assessment-builder.context";
import { useQuestionValidation } from "../../hooks/useQuestionValidation";

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

  // states
  const [isValidated, setIsValidated] = useState<boolean>(false);

  // error tracker
  const errors = useQuestionValidation(question);

  // handlers
  const handleTypeChange = (type: QuestionType) => {
    questionDispatch({ type: "SET_TYPE", payload: type });
    setIsValidated(false);
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
    setIsValidated(true);
    if (Object.keys(errors).length > 0) {
      console.log(errors);
      return;
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
    }

    onClose();
  };

  return (
    <motion.article
      className="flex flex-col w-[100vw] h-full min-h-[100vh] overflow-y-auto fixed md:h-fit md:min-h-0 md:w-[800px] md:rounded-sm md:drop-shadow-sm md:top-1/2 md:-translate-y-[60%] md:left-1/2 md:right-1/2 md:-translate-x-1/2 md:absolute bg-white dark:bg-gray-800 transition-colors duration-200"
      key="add-question-modal"
      initial={{ opacity: 0, scale: 1, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1, y: 50 }}
      transition={{ duration: 0.25 }}
    >
      {/* header */}
      <header className="p-4 bg-inherit rounded-t-sm flex items-center justify-between border-b border-b-gray-300 dark:border-b-gray-600 transition-colors duration-200">
        <h3 className="text-gray-900 dark:text-gray-100 transition-colors duration-200">
          New Question
        </h3>
        {/* close button */}
        <button
          className="opacity-80 hidden md:block hover:opacity-100 hover:cursor-pointer transition-all duration-200 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          type="button"
          onClick={onClose}
        >
          <IoClose size={24} />
        </button>
      </header>

      {/* form */}
      <section className="flex-1 flex flex-col bg-inherit rounded-b-sm p-4">
        <form className="flex flex-col gap-4 flex-1 justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              {/* question type */}
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                <label
                  htmlFor="type"
                  className="font-semibold w-32 min-w-32 md:text-right text-sm md:text-base text-gray-900 dark:text-gray-100 transition-colors duration-200"
                >
                  Question Type
                </label>
                <QuestionTypeSelect
                  onTypeChange={handleTypeChange}
                  classes={"w-full text-sm md:text-base md:w-48"}
                />
              </div>

              {/* points */}
              <div className="flex flex-col md:flex-row gap-2 md:gap-4 md:items-center">
                <label
                  htmlFor="points"
                  className="font-semibold text-sm md:text-base text-gray-900 dark:text-gray-100 transition-colors duration-200"
                >
                  Points
                </label>
                <input
                  id="points"
                  type="number"
                  className="border border-gray-300 dark:border-gray-600 text-center text-sm md:text-base rounded-sm px-2 py-1 w-24 focus:outline-none focus:ring-1 focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
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
            <div className="flex flex-col md:flex-row gap-2 md:gap-4">
              {/* Question Field */}
              <label
                htmlFor="question"
                className="text-sm md:text-base font-semibold w-32 min-w-32 md:text-right text-gray-900 dark:text-gray-100 transition-colors duration-200"
              >
                Question
              </label>
              <div className="flex flex-col w-full gap-2">
                <RichTextField
                  value={question.question}
                  onContentChange={handleQuestionContentChange}
                  classes="h-fit max-h-[200px] md:max-h-[150px]"
                />
                <AnimatePresence>
                  {isValidated &&
                    errors.question &&
                    question.type !== "fill_in_the_blanks" && (
                      <motion.p
                        className="text-xs md:text-sm text-red-500 dark:text-red-400 self-end transition-colors duration-200"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{
                          opacity: 0,
                          y: 0,
                          transition: { duration: 0.1 },
                        }}
                        key="fill-in-the-blank-error"
                      >
                        {errors.question}
                      </motion.p>
                    )}
                </AnimatePresence>
                <AnimatePresence>
                  {isValidated && errors.fillInTheBlankQuestion && (
                    <motion.p
                      className="text-xs md:text-sm text-red-500 dark:text-red-400 self-end transition-colors duration-200"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 0, transition: { duration: 0.1 } }}
                      key="fill-in-the-blank-error"
                    >
                      {errors.fillInTheBlankQuestion}
                    </motion.p>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {/* info for fill in the blanks */}
                  {question.type === "fill_in_the_blanks" && (
                    <motion.div
                      className="p-2 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 transition-colors duration-200"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      key="fill-in-the-blank-info"
                    >
                      <p className="italic text-right text-xs text-gray-700 dark:text-gray-300 transition-colors duration-200">
                        Use brackets to indicate blanks. <br />
                        Example: The capital of the Philippines is [1] <br />
                        "The capital of the Philippines is _____"
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            {/* divider */}
            <div className="border-b border-b-gray-300 dark:border-b-gray-600 transition-colors duration-200"></div>
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
                      isValidated={isValidated}
                      question={question}
                      onAnswersChange={handleAnswersChange}
                      onChoicesChange={handleChoicesChange}
                      onToggleRandom={handleToggleRandom}
                      errors={errors}
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
                        isValidated={isValidated}
                        errors={errors}
                      />
                    </motion.div>
                  )
                )}
              </div>
            </AnimatePresence>
          </div>
          {/* actions */}
          <ModalActions
            onAddContent={handleAddQuestion}
            onCancelClick={onClose}
          />
        </form>
      </section>
    </motion.article>
  );
}
