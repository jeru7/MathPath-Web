import { nanoid } from "nanoid";
import {
  AssessmentQuestion,
  AssessmentQuestionChoice,
  FillInTheBlankAnswerType,
  QuestionType,
} from "../../../../../../../core/types/assessment/assessment.type";

// types
type Action =
  | { type: "SET_TYPE"; payload: QuestionType }
  | { type: "SET_POINTS"; payload: number }
  | { type: "SET_QUESTION"; payload: string }
  | { type: "SET_CHOICES"; payload: AssessmentQuestionChoice[] }
  | {
      type: "SET_ANSWERS";
      payload: string | boolean | string[] | FillInTheBlankAnswerType[];
    }
  | { type: "SET_RANDOM"; payload: boolean };

// methods
export const addQuestionReducer = (
  state: AssessmentQuestion,
  action: Action,
): AssessmentQuestion => {
  switch (action.type) {
    case "SET_TYPE":
      if (state.type === action.payload) return state;
      return getDefaultQuestion(action.payload);
    case "SET_POINTS":
      return { ...state, points: action.payload };
    case "SET_QUESTION":
      if (state.type === "fill_in_the_blanks") {
        const matches = action.payload.match(/\[(\d+)\]/g) || [];
        const uniqueMatches = Array.from(new Set(matches));
        const existing = new Map(
          (state.answers as FillInTheBlankAnswerType[]).map((answer) => [
            answer.label,
            answer,
          ]),
        );

        const updatedAnswers = uniqueMatches
          .map((label) => {
            const number = label.match(/^\[(\d+)\]$/)?.[1];
            if (!number) return null;

            const existingLabel = existing.get(number);
            return existingLabel
              ? existingLabel
              : {
                  id: nanoid(),
                  label: number.toString(),
                  value: "",
                };
          })
          .filter(Boolean) as FillInTheBlankAnswerType[];

        return {
          ...state,
          question: action.payload,
          answers: updatedAnswers,
        };
      } else {
        return { ...state, question: action.payload };
      }
    case "SET_CHOICES":
      if (state.type === "single_choice" || state.type === "multiple_choice") {
        return { ...state, choices: action.payload };
      }
      return state;
    case "SET_ANSWERS":
      if (state.type === "single_choice" || state.type === "multiple_choice") {
        return { ...state, answers: action.payload as string[] };
      } else if (state.type === "fill_in_the_blanks") {
        return {
          ...state,
          answers: action.payload as FillInTheBlankAnswerType[],
        };
      } else if (state.type === "true_or_false") {
        return { ...state, answers: action.payload as boolean };
      } else if (state.type === "identification") {
        return { ...state, answers: action.payload as string };
      }
      return state;
    case "SET_RANDOM":
      if (state.type === "single_choice" || state.type === "multiple_choice") {
        return { ...state, randomPosition: action.payload as boolean };
      }
      return state;
    default:
      return state;
  }
};

export const getDefaultQuestion = (type: QuestionType): AssessmentQuestion => {
  switch (type) {
    case "single_choice":
    case "multiple_choice":
      return {
        id: nanoid(),
        type,
        question: "",
        points: 1,
        choices: [
          { id: nanoid(), text: "" },
          { id: nanoid(), text: "" },
        ],
        answers: [],
        randomPosition: false,
      };
    case "fill_in_the_blanks":
      return {
        id: nanoid(),
        type,
        question: "",
        points: 1,
        answers: [],
      };
    case "true_or_false":
      return {
        id: nanoid(),
        type,
        question: "",
        points: 1,
        answers: true,
      };
    case "identification":
      return {
        id: nanoid(),
        type,
        question: "",
        points: 1,
        answers: "",
      };
    default:
      return {
        id: nanoid(),
        type: "single_choice",
        question: "",
        points: 1,
        choices: [{ id: nanoid(), text: "" }],
        answers: [],
        randomPosition: false,
      };
  }
};
