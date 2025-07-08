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

export type AssessmentQuestion =
  | {
      type: "single_choice" | "multiple_choice";
      question: string;
      points: number;
      choices: AssessmentQuestionChoice[];
      answers: string[];
    }
  | {
      type: "fill_in_the_blanks";
      question: string;
      points: number;
      answers: FillInTheBlankAnswerType[];
    }
  | {
      type: "true_or_false";
      question: string;
      points: number;
      answers: boolean;
    }
  | {
      type: "identification";
      question: string;
      points: number;
      answers: string;
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
