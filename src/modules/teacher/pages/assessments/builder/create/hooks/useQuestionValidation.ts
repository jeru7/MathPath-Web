import { useMemo } from "react";
import { AssessmentQuestion } from "../../../../../../core/types/assessment/assessment.type";

export const useQuestionValidation = (question: AssessmentQuestion) => {
  return useMemo(() => {
    const newErrors: { [key: string]: string | number[] } = {};

    if (
      question.question.trim() === "" ||
      question.question.trim().length === 0
    ) {
      newErrors.question = "Question is required.";
    }

    if (question.type === "fill_in_the_blanks") {
      if (question.answers.length === 0) {
        newErrors.fillInTheBlankQuestion =
          "Please add at least one blank in your question using [1], [2], etc.";
      }
    }

    if (
      question.type === "single_choice" ||
      question.type === "multiple_choice"
    ) {
      // stores the choices index that has an empty content
      const emptyChoicesIndeces = question.choices
        .map((choice, index) => (choice.text.trim().length === 0 ? index : -1))
        .filter((index) => index !== -1);

      if (emptyChoicesIndeces.length > 0) {
        newErrors.choices = emptyChoicesIndeces;
      }

      if (question.answers.length === 0) {
        newErrors.answer = "Select at least 1 correct answer.";
      }

      if (
        question.answers.length === question.choices.length &&
        question.type === "multiple_choice"
      ) {
        newErrors.multiChoiceAnswer = "Leave at least 1 wrong choice.";
      }
    }

    return newErrors;
  }, [question]);
};
