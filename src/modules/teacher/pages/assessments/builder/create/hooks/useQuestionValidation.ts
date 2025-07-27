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

    if (
      question.type === "single_choice" ||
      question.type === "multiple_choice"
    ) {
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

      const texts = question.choices.map((choice) => choice.text.trim());
      const hasDuplicate = new Set(texts).size !== texts.length;

      if (hasDuplicate) {
        newErrors.duplicateChoices = "Duplicate choices are not allowed.";
      }
    }

    if (question.type === "fill_in_the_blanks") {
      if (question.answers.length === 0) {
        newErrors.fillInTheBlankQuestion =
          "Add at least one blank in your question using [1], [2], etc.";
      }

      const emptyAnswersIndeces = question.answers
        .map((answer, index) => (answer.value.trim().length === 0 ? index : -1))
        .filter((index) => index !== -1);

      if (emptyAnswersIndeces.length > 0) {
        newErrors.fillInTheBlankAnswers = emptyAnswersIndeces;
      }
    }

    if (question.type === "identification") {
      if (question.answers.trim().length === 0) {
        newErrors.identificationAnswer = "Answer is required.";
      }
    }

    return newErrors;
  }, [question]);
};
