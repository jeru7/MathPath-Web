// assessment
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

// assessment page content
export type AssessmentContent = {
  _id?: string;
  type: AssessmentContentTypes;
  data: string | AssessmentQuestion;
};

export type AssessmentContentTypes = "image" | "question" | "text";

// assessment page
export type AssessmentPage = {
  id: string;
  title?: string;
  contents: AssessmentContent[];
};

// DTO
// create assessment
export type CreateAssessment = {
  name: string;
  topic: string;
  description: string;
  teacher: string;
  sections: string[];
  questions: AssessmentQuestion[];
  deadline: Date;
};
