export type Assessment = {
  _id: string;
  name: string;
  teachers: string[];
  sections: string[];
  questions: Question[];
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type Question = {
  question: string;
  choices: string[];
  answer: string;
};
