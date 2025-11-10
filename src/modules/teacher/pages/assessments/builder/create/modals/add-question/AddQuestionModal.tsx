import { useReducer, useState, type ReactElement } from "react";
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
import { getDefaultQuestion, addQuestionReducer } from "./add-question.reducer";
import { useAssessmentBuilder } from "../../../context/assessment-builder.context";
import { useQuestionValidation } from "../../hooks/useQuestionValidation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NumberInputWithControls } from "@/components/custom/num-input";

// types
type AddQuestionModalProps = {
  onClose: () => void;
  pageId: string;
  contentToEdit: AssessmentContent | null;
  open: boolean;
};

// default
export default function AddQuestionModal({
  onClose,
  pageId,
  contentToEdit,
  open,
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[100dvw] h-[100dvh] max-w-none sm:max-w-4xl sm:max-h-[90vh] sm:h-fit overflow-y-auto flex flex-col p-0">
        <DialogHeader className="px-4 sm:px-6 py-4 border-b flex-shrink-0">
          <DialogTitle>
            {contentToEdit ? "Edit Question" : "New Question"}
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 sm:p-6 space-y-6 flex-1 overflow-auto">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="type" className="text-sm font-medium">
                Question Type
              </Label>
              <QuestionTypeSelect
                onTypeChange={handleTypeChange}
                defaultValue={question.type}
                className="w-full"
              />
            </div>

            <div className="flex flex-col gap-2 pr-8">
              <Label htmlFor="points" className="text-sm font-medium">
                Points
              </Label>
              <NumberInputWithControls
                id="points"
                value={question.points}
                min={1}
                max={5}
                onChange={handlePointsChange}
                className="w-full sm:w-fit"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="question" className="text-sm font-medium">
              Question
            </Label>
            <div className="space-y-3">
              <RichTextField
                value={question.question}
                onContentChange={handleQuestionContentChange}
                classes="h-fit min-h-[120px] max-h-[300px] sm:max-h-[200px]"
              />

              <AnimatePresence>
                {isValidated &&
                  errors.question &&
                  question.type !== "fill_in_the_blanks" && (
                    <motion.p
                      className="text-xs text-destructive font-medium"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        y: 0,
                        transition: { duration: 0.1 },
                      }}
                      key="question-error"
                    >
                      {errors.question}
                    </motion.p>
                  )}
              </AnimatePresence>

              <AnimatePresence>
                {isValidated && errors.fillInTheBlankQuestion && (
                  <motion.p
                    className="text-xs text-destructive font-medium"
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
                {question.type === "fill_in_the_blanks" && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    key="fill-in-the-blank-info"
                  >
                    <Alert className="bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800">
                      <AlertDescription className="text-xs text-yellow-800 dark:text-yellow-200">
                        <strong>How to create blanks:</strong> Use brackets to
                        indicate blanks. <br />
                        <strong>Example:</strong> "The capital of the
                        Philippines is [1]" <br />
                        <strong>Result:</strong> "The capital of the Philippines
                        is _____"
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <AnimatePresence mode="wait">
              <div className="space-y-4">
                {question.type === "single_choice" ||
                  question.type === "multiple_choice" ? (
                  <motion.div
                    key="choices"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
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
                  // Answer fields for the rest of types
                  (((question.answers as string[] | FillInTheBlankAnswerType[])
                    .length > 0 &&
                    question.type === "fill_in_the_blanks") ||
                    question.type === "identification" ||
                    question.type === "true_or_false") && (
                    <motion.div
                      key="answers"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
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
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-4 sm:p-6 border-t bg-muted/30 flex-shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 order-2 sm:order-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddQuestion}
            className="flex-1 order-1 sm:order-2"
          >
            {contentToEdit ? "Update Question" : "Add Question"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
