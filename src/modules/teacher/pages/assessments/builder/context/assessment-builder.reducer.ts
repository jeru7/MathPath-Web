import {
  Assessment,
  AssessmentContent,
  AssessmentPage,
  AssessmentQuestion,
} from "../../../../../core/types/assessment/assessment.types";
import { nanoid } from "nanoid";

// initial state
export const initialAssessment: Assessment = {
  id: nanoid(),
  title: null,
  topic: null,
  description: null,
  teacher: "",
  sections: [],
  pages: [
    {
      id: nanoid(),
      title: null,
      contents: [],
    },
  ],
  passingScore: null,
  attempts: null,
  date: {
    start: null,
    end: null,
  },
  duration: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// types
export type AssessmentBuilderAction = // TODO: assessment
  //
  //
  //

  // page
  | {
      type: "ADD_PAGE";
      payload: AssessmentPage;
    }
  | {
      type: "DELETE_PAGE";
      payload: string;
    }
  | { type: "SET_PAGE"; payload: AssessmentPage[] }
  | {
      type: "UPDATE_PAGE_CONTENT";
      payload: { pageId: string; contents: AssessmentContent[] };
    }
  | {
      type: "UPDATE_PAGE_TITLE";
      payload: { pageId: string; title: string };
    }

  // page content
  | {
      type: "ADD_QUESTION";
      payload: { pageId: string; question: AssessmentQuestion };
    }
  | {
      type: "UPDATE_QUESTION";
      payload: {
        pageId: string;
        contentId: string;
        question: AssessmentQuestion;
      };
    }
  | {
      type: "ADD_IMAGE";
      payload: { pageId: string; imageUrl: string };
    }
  | {
      type: "UPDATE_IMAGE";
      payload: { pageId: string; contentId: string; imageUrl: string };
    }
  | {
      type: "ADD_TEXT";
      payload: { pageId: string; text: string };
    }
  | {
      type: "UPDATE_TEXT";
      payload: { pageId: string; contentId: string; text: string };
    }
  | {
      type: "DELETE_CONTENT";
      payload: { pageId: string; content: AssessmentContent };
    };

// methods
export const assessmentBuilderReducer = (
  state: Assessment,
  action: AssessmentBuilderAction,
): Assessment => {
  switch (action.type) {
    case "ADD_PAGE":
      return {
        ...state,
        pages: [...state.pages, action.payload],
      };
    case "DELETE_PAGE":
      return {
        ...state,
        pages: state.pages.filter((page) => page.id !== action.payload),
      };
    case "SET_PAGE":
      return {
        ...state,
        pages: action.payload,
      };
    case "UPDATE_PAGE_CONTENT": {
      const newPages = state.pages.map((page) => {
        if (page.id === action.payload.pageId) {
          return {
            ...page,
            contents: action.payload.contents,
          };
        }
        return page;
      });
      return {
        ...state,
        pages: newPages,
      };
    }
    case "UPDATE_PAGE_TITLE": {
      const newPages = state.pages.map((page) => {
        if (page.id === action.payload.pageId) {
          return {
            ...page,
            title: action.payload.title,
          };
        }
        return page;
      });
      return {
        ...state,
        pages: newPages,
      };
    }
    case "ADD_QUESTION": {
      const newPages = state.pages.map((page) => {
        if (page.id === action.payload.pageId) {
          return {
            ...page,
            contents: [
              ...page.contents,
              {
                id: nanoid(),
                type: "question" as const,
                data: action.payload.question,
              },
            ],
          };
        }
        return page;
      });
      return {
        ...state,
        pages: newPages,
      };
    }
    case "UPDATE_QUESTION": {
      const newPages = state.pages.map((page) => {
        if (page.id === action.payload.pageId) {
          return {
            ...page,
            contents: page.contents.map((content) => {
              if (content.id === action.payload.contentId) {
                return {
                  ...content,
                  data: action.payload.question,
                };
              }

              return content;
            }),
          };
        }
        return page;
      });
      return {
        ...state,
        pages: newPages,
      };
    }
    case "ADD_IMAGE": {
      const newPages = state.pages.map((page) => {
        if (page.id === action.payload.pageId) {
          return {
            ...page,
            contents: [
              ...page.contents,
              {
                id: nanoid(),
                type: "image" as const,
                data: action.payload.imageUrl,
              },
            ],
          };
        }
        return page;
      });
      return {
        ...state,
        pages: newPages,
      };
    }
    case "UPDATE_IMAGE": {
      const newPages = state.pages.map((page) => {
        if (page.id === action.payload.pageId) {
          return {
            ...page,
            contents: page.contents.map((content) => {
              if (content.id === action.payload.contentId) {
                return {
                  ...content,
                  data: action.payload.imageUrl,
                };
              }

              return content;
            }),
          };
        }
        return page;
      });
      return {
        ...state,
        pages: newPages,
      };
    }
    case "ADD_TEXT": {
      const newPages = state.pages.map((page) => {
        if (page.id === action.payload.pageId) {
          return {
            ...page,
            contents: [
              ...page.contents,
              {
                id: nanoid(),
                type: "text" as const,
                data: action.payload.text,
              },
            ],
          };
        }
        return page;
      });
      return {
        ...state,
        pages: newPages,
      };
    }
    case "UPDATE_TEXT": {
      const newPages = state.pages.map((page) => {
        if (page.id === action.payload.pageId) {
          return {
            ...page,
            contents: page.contents.map((content) => {
              if (content.id === action.payload.contentId) {
                return {
                  ...content,
                  data: action.payload.text,
                };
              }

              return content;
            }),
          };
        }
        return page;
      });
      return {
        ...state,
        pages: newPages,
      };
    }
    case "DELETE_CONTENT": {
      const newPages = state.pages.map((page) => {
        if (page.id === action.payload.pageId) {
          return {
            ...page,
            contents: page.contents.filter(
              (content) => content.id !== action.payload.content.id,
            ),
          };
        }
        return page;
      });
      return {
        ...state,
        pages: newPages,
      };
    }
    default:
      return state;
  }
};
