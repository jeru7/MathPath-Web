import { type ReactElement } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AnswerField from "./AnswerField";
import {
  FillInTheBlankAnswerType,
  QuestionType,
} from "../../../../../../../../core/types/assessment/assessment.type";

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
    <div className="flex flex-col md:flex-row items-start gap-2 md:gap-4">
      <label className="text-sm md:text-base font-semibold w-32 min-w-32 md:text-right text-gray-900 dark:text-gray-100 transition-colors duration-200">
        {type === "fill_in_the_blanks" ? "Answers" : "Answer"}
      </label>
      <section className="border border-gray-300 dark:border-gray-600 rounded-sm bg-white dark:bg-gray-800 w-full h-fit flex flex-col transition-colors duration-200">
        <div className="w-full flex justify-end p-1 bg-gray-100 dark:bg-gray-700 border-b border-b-gray-300 dark:border-b-gray-600 h-[40px] px-2 transition-colors duration-200"></div>

        <motion.section
          className="flex flex-col p-2 gap-2 relative overflow-y-auto"
          style={{ maxHeight: "250px" }}
        >
          <AnimatePresence>
            {/* fill in the blanks */}
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

            {/*  identification */}
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

            {/* true or false */}
            {type === "true_or_false" && (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="flex gap-4"
              >
                <AnswerField
                  type="radio"
                  name="true-or-false"
                  value={true}
                  checked={answers === true}
                  onChange={() => onAnswersChange(true)}
                  radioLabel="True"
                />

                <AnswerField
                  type="radio"
                  name="true-or-false"
                  value={false}
                  checked={answers === false}
                  onChange={() => onAnswersChange(false)}
                  radioLabel="False"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </section>
    </div>
  );
}
