import { type ReactElement } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AnswerField from "./AnswerField";
import {
  FillInTheBlankAnswerType,
  QuestionType,
} from "../../../../../../../../core/types/assessment/assessment.types";

type AnswersProp = {
  onAnswersChange: (
    answer: string | boolean | FillInTheBlankAnswerType[],
  ) => void;
  answers?: string[] | FillInTheBlankAnswerType[] | string | boolean;
  type?: QuestionType;
};
export default function Answers({
  onAnswersChange,
  answers,
  type,
}: AnswersProp): ReactElement {
  return (
    <div className="flex items-start gap-4">
      <label className="font-semibold w-32 min-w-32 text-right">
        {type === "fill_in_the_blanks" ? "Answers" : "Answer"}
      </label>
      <section className="border border-gray-300 rounded-sm bg-white w-full h-fit flex flex-col">
        <div className="w-full flex justify-end p-1 bg-gray-100 border-b border-b-gray-300 h-[40px] px-2"></div>

        <motion.section
          className="flex flex-col p-2 gap-2 relative overflow-y-auto"
          style={{ maxHeight: "250px" }}
        >
          <AnimatePresence>
            {/* Text input for fill in the blanks */}
            {type === "fill_in_the_blanks" &&
              (answers as FillInTheBlankAnswerType[])?.map((answer) => (
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
                  />
                </motion.div>
              ))}

            {/* Text input for identification */}
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
                />
              </motion.div>
            )}

            {/* Radio buttons for true or false */}
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
