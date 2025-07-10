import { useReducer } from "react";
import { nanoid } from "nanoid";
import {
  AssessmentQuestion,
  AssessmentQuestionChoice,
  FillInTheBlankAnswerType,
  QuestionType,
} from "../../../../../../core/types/assessment/assessment.types";

// types
type Action =
  | { type: "SET_TYPE"; payload: QuestionType }
  | { type: "SET_POINTS"; payload: number }
  | { type: "SET_QUESTION"; payload: string }
  | { type: "SET_CHOICES"; payload: AssessmentQuestionChoice[] }
  | {
      type: "SET_ANSWERS";
      payload: string | boolean | string[] | FillInTheBlankAnswerType[];
    };

// use reducer method
export const useQuestionReducer = (type: QuestionType = "single_choice") => {
  const [state, dispatch] = useReducer(reducer, getDefaultQuestion(type));
  return { question: state, dispatch };
};

// methods
const reducer = (
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
    default:
      return state;
  }
};

const getDefaultQuestion = (type: QuestionType): AssessmentQuestion => {
  switch (type) {
    case "single_choice":
    case "multiple_choice":
      return {
        type,
        question: "",
        points: 1,
        choices: [{ id: nanoid(), text: "" }],
        answers: [],
      };
    case "fill_in_the_blanks":
      return {
        type,
        question: "",
        points: 1,
        answers: [],
      };
    case "true_or_false":
      return {
        type,
        question: "",
        points: 1,
        answers: true,
      };
    case "identification":
      return {
        type,
        question: "",
        points: 1,
        answers: "",
      };
    default:
      return {
        type: "single_choice",
        question: "",
        points: 1,
        choices: [{ id: nanoid(), text: "" }],
        answers: [],
      };
  }
};
