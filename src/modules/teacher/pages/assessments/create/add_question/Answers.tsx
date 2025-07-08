import { type ReactElement } from "react";
import { AnimatePresence, motion } from "framer-motion";
import FillInTheBlankAnswer from "./fill-in-the-blanks/Answer";
import IdentificationAnswer from "./identification/Answer";
import TrueOrFalseAnswer from "./true-or-false/Answer";
import {
  FillInTheBlankAnswerType,
  QuestionType,
} from "../../../../../core/types/assessment/assessment.types";

type AnswersProp = {
  answers?: FillInTheBlankAnswerType[];
  type?: QuestionType;
};
export default function Answers({ answers, type }: AnswersProp): ReactElement {
  return (
    <div className="flex items-start gap-4">
      <label className="font-semibold w-32 min-w-32 text-right">
        {type === "fill_in_the_blanks" ? "Answers" : "Answer"}
      </label>
      {type === "fill_in_the_blanks" ? (
        <section className="border border-gray-300 rounded-sm bg-white w-full h-fit flex flex-col">
          <div className="w-full flex justify-end p-1 bg-gray-100 border-b border-b-gray-300 h-[40px] px-2"></div>

          <motion.section
            className="flex flex-col p-2 gap-2 relative overflow-y-auto"
            style={{ maxHeight: "250px" }}
          >
            <AnimatePresence>
              {answers?.map((answer) => (
                <motion.div
                  key={answer.id}
                  layout
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                >
                  <FillInTheBlankAnswer answer={answer} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.section>
        </section>
      ) : type === "identification" ? (
        <section className="border border-gray-300 rounded-sm bg-white w-full h-fit flex flex-col">
          <div className="w-full flex justify-end p-1 bg-gray-100 border-b border-b-gray-300 h-[40px] px-2"></div>

          <motion.section
            className="flex flex-col p-2 gap-2 relative overflow-y-auto"
            style={{ maxHeight: "250px" }}
          >
            <AnimatePresence>
              <motion.div
                layout
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
              >
                <IdentificationAnswer />
              </motion.div>
            </AnimatePresence>
          </motion.section>
        </section>
      ) : type === "true_or_false" ? (
        <section className="border border-gray-300 rounded-sm bg-white w-full h-fit flex flex-col">
          <div className="w-full flex justify-end p-1 bg-gray-100 border-b border-b-gray-300 h-[40px] px-2"></div>

          <motion.section
            className="flex flex-col p-2 gap-2 relative overflow-y-auto"
            style={{ maxHeight: "250px" }}
          >
            <AnimatePresence>
              <motion.div
                layout
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
              >
                <TrueOrFalseAnswer />
              </motion.div>
            </AnimatePresence>
          </motion.section>
        </section>
      ) : null}
    </div>
  );
}
