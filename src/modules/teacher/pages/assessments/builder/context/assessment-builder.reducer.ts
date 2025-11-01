import {
  Assessment,
  AssessmentContent,
  AssessmentPage,
  AssessmentQuestion,
} from "../../../../../core/types/assessment/assessment.type";
import { nanoid } from "nanoid";

// types
export type AssessmentBuilderAction =
  // assessment
  | {
    type: "SET_ASSESSMENT";
    payload: Assessment;
  }
  | {
    type: "UPDATE_ASSESSMENT_TITLE";
    payload: string;
  }
  | {
    type: "UPDATE_ASSESSMENT_TOPIC";
    payload: string;
  }
  | {
    type: "UPDATE_ASSESSMENT_DESCRIPTION";
    payload: string;
  }
  | {
    type: "UPDATE_ASSESSMENT_PASSING_SCORE";
    payload: number;
  }
  | {
    type: "UPDATE_ASSESSMENT_ATTEMPT_LIMIT";
    payload: number;
  }
  | {
    type: "UPDATE_ASSESSMENT_TIME_LIMIT";
    payload: number;
  }
  | {
    type: "UPDATE_SECTION";
    payload: string[];
  }
  | {
    type: "ADD_START_DATE";
    payload: Date;
  }
  | {
    type: "ADD_END_DATE";
    payload: Date;
  }
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
    payload: { pageId: string; imageUrl: string; publicId: string };
  }
  | {
    type: "UPDATE_IMAGE";
    payload: {
      pageId: string;
      contentId: string;
      imageUrl: string;
      publicId: string;
    };
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
    // assessment
    case "UPDATE_ASSESSMENT_TITLE":
      return { ...state, title: action.payload };
    case "UPDATE_ASSESSMENT_TOPIC":
      return { ...state, topic: action.payload };
    case "UPDATE_ASSESSMENT_DESCRIPTION":
      return { ...state, description: action.payload };
    case "UPDATE_ASSESSMENT_PASSING_SCORE":
      return { ...state, passingScore: action.payload };
    case "UPDATE_ASSESSMENT_ATTEMPT_LIMIT":
      return { ...state, attemptLimit: action.payload };
    case "UPDATE_ASSESSMENT_TIME_LIMIT":
      return { ...state, timeLimit: action.payload ?? 10 };
    case "UPDATE_SECTION": {
      return {
        ...state,
        sections: action.payload,
      };
    }
    case "ADD_START_DATE":
      return {
        ...state,
        date: { ...state.date, start: action.payload.toISOString() },
      };
    case "ADD_END_DATE":
      return {
        ...state,
        date: { ...state.date, end: action.payload.toISOString() },
      };
    // page
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
                  type: "question" as const,
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
                data: {
                  secureUrl: action.payload.imageUrl,
                  publicId: action.payload.publicId,
                },
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
                  type: "image" as const,
                  data: {
                    secureUrl: action.payload.imageUrl,
                    publicId: action.payload.publicId,
                  },
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
              if (
                content.id === action.payload.contentId &&
                content.type === "text"
              ) {
                return {
                  id: content.id,
                  type: "text" as const,
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
