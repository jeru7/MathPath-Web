export interface IAssessment {
  _id: string;
  name: string;
  teachers: string[];
  sections: string[];
  questions: QuestionType[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface QuestionType {
  question: string;
  choices: string[];
  answer: string;
}
