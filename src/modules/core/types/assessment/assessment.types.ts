export type Assessment = {
  id: string;
  title: string;
  topic: string;
  description?: string;
  teacher: string;
  sections: string[];
  pages: AssessmentPage[];
  passingScore: number;
  attempts: number;
  date: {
    start: string;
    end: string;
  };
  duration?: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateAssessment = {
  name: string;
  topic: string;
  description: string;
  teacher: string;
  sections: string[];
  questions: AssessmentQuestion[];
  deadline: Date;
};

export type QuestionType =
  | "multiple_choice"
  | "fill_in_the_blanks"
  | "true_or_false"
  | "identification"
  | "single_choice";

export type AssessmentQuestion = {
  question: string;
  points: number;
  type: QuestionType;
  choices?: AssessmentQuestionChoice[];
  answer: string | string[];
};

export type AssessmentQuestionChoice = {
  id: string;
  text: string;
};

export type FillInTheBlankAnswerType = {
  id: string;
  label: string;
  value: string;
};

export type AssessmentContent = {
  _id?: string;
  type: "image" | "question" | "text";
  data: string | AssessmentQuestion;
};

export type AssessmentPage = {
  title?: string;
  contents: AssessmentContent[];
};
