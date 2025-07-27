import {
  AssessmentContent,
  AssessmentQuestion,
} from "../../../../../../../core/types/assessment/assessment.type";
import { nanoid } from "nanoid";

export const getDefaultQuestion = (
  contentToEdit: AssessmentContent | null,
): AssessmentQuestion => {
  if (!contentToEdit || contentToEdit.type !== "question") {
    return {
      id: nanoid(),
      type: "single_choice",
      question: "",
      points: 1,
      choices: [
        { id: nanoid(), text: "" },
        { id: nanoid(), text: "" },
      ],
      answers: [],
      randomPosition: false,
    };
  }

  const data = contentToEdit.data as AssessmentQuestion;

  switch (data.type) {
    case "single_choice":
    case "multiple_choice":
      return {
        id: data.id,
        type: data.type,
        question: data.question,
        points: data.points,
        choices: data.choices,
        answers: data.answers,
        randomPosition: data.randomPosition,
      };

    case "fill_in_the_blanks":
      return {
        id: data.id,
        type: data.type,
        question: data.question,
        points: data.points,
        answers: data.answers,
      };

    case "true_or_false":
      return {
        id: data.id,
        type: data.type,
        question: data.question,
        points: data.points,
        answers: data.answers,
      };

    case "identification":
      return {
        id: data.id,
        type: data.type,
        question: data.question,
        points: data.points,
        answers: data.answers,
      };

    default:
      throw new Error("Unsupported question type");
  }
};
