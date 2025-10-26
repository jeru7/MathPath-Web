export type Assessment = {
  id: string;
  title: string | null;
  topic: string | null;
  description: string | null;
  teacher: string;
  sections: string[];
  pages: AssessmentPage[];
  passingScore: number;
  attemptLimit: number;
  date: {
    start: string | null;
    end: string | null;
  };
  timeLimit: number;
  status: AssessmentStatus;
  createdAt: string;
  updatedAt: string;
};

// assessment status
export type AssessmentStatus =
  | "finished"
  | "draft"
  | "in-progress"
  | "published";

// assessment question types
export type QuestionType =
  | "multiple_choice"
  | "fill_in_the_blanks"
  | "true_or_false"
  | "identification"
  | "single_choice";

// assessment question structure based on types
export type AssessmentQuestion =
  | {
    id: string;
    type: "single_choice" | "multiple_choice";
    question: string;
    points: number;
    choices: AssessmentQuestionChoice[];
    answers: string[];
    randomPosition: boolean;
  }
  | {
    id: string;
    type: "fill_in_the_blanks";
    question: string;
    points: number;
    answers: FillInTheBlankAnswerType[];
  }
  | {
    id: string;
    type: "true_or_false";
    question: string;
    points: number;
    answers: boolean;
  }
  | {
    id: string;
    type: "identification";
    question: string;
    points: number;
    answers: string;
  };

// assessment question choice for multi or single choice
export type AssessmentQuestionChoice = {
  id: string;
  text: string;
};

// assessment answer type for fill in the blanks
export type FillInTheBlankAnswerType = {
  id: string;
  label: string;
  value: string;
};

export type AssessmentImage = {
  secureUrl: string;
  publicId: string;
};

// assessment page content
export type AssessmentContent =
  | {
    id: string;
    type: "image";
    data: AssessmentImage;
  }
  | {
    id: string;
    type: "question";
    data: AssessmentQuestion;
  }
  | {
    id: string;
    type: "text";
    data: string;
  };

export type AssessmentContentTypes = "image" | "question" | "text";

// assessment page
export type AssessmentPage = {
  id: string;
  title?: string | null;
  contents: AssessmentContent[];
};
