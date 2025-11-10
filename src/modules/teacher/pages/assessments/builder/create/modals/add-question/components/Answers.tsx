import { type ReactElement } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AnswerField from "./AnswerField";
import {
  FillInTheBlankAnswerType,
  QuestionType,
} from "../../../../../../../../core/types/assessment/assessment.type";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type AnswersProp = {
  onAnswersChange: (
    answer: string | boolean | FillInTheBlankAnswerType[],
  ) => void;
  answers?: string[] | FillInTheBlankAnswerType[] | string | boolean;
  type?: QuestionType;
  isValidated: boolean;
  errors: { [key: string]: string | number[] };
};

export default function Answers({
  onAnswersChange,
  answers,
  type,
  isValidated,
  errors,
}: AnswersProp): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      <Label className="text-sm font-medium">
        {type === "fill_in_the_blanks" ? "Answers" : "Answer"}
      </Label>
      <Card>
        <CardHeader className="pb-3">
          <Label className="text-sm font-medium">
            {type === "fill_in_the_blanks"
              ? "Fill in the Blank"
              : type === "identification"
                ? "Identification"
                : "True or False"}
          </Label>
        </CardHeader>
        <CardContent className="space-y-3">
          <AnimatePresence>
            {type === "fill_in_the_blanks" &&
              (answers as FillInTheBlankAnswerType[])?.map((answer, index) => (
                <motion.div
                  key={answer.id}
                  layout
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                >
                  <AnswerField
                    label={answer.label}
                    type="text"
                    value={answer.value}
                    onChange={(val) => {
                      const updatedAnswers = (
                        answers as FillInTheBlankAnswerType[]
                      ).map((a) =>
                        a.id === answer.id ? { ...a, value: val as string } : a,
                      );
                      onAnswersChange(updatedAnswers);
                    }}
                    isEmpty={
                      isValidated &&
                      type === "fill_in_the_blanks" &&
                      Array.isArray(errors?.fillInTheBlankAnswers) &&
                      errors.fillInTheBlankAnswers.includes(index)
                    }
                  />
                </motion.div>
              ))}

            {type === "identification" && (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
              >
                <AnswerField
                  type="text"
                  value={answers as string}
                  onChange={(val) => onAnswersChange(val as string)}
                  isEmpty={
                    isValidated &&
                    type === "identification" &&
                    errors?.identificationAnswer !== undefined
                  }
                />
              </motion.div>
            )}

            {type === "true_or_false" && (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
              >
                <AnswerField
                  type="radio"
                  name="true-or-false"
                  value={answers as boolean}
                  onChange={onAnswersChange}
                  checked={answers === true || answers === false}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
