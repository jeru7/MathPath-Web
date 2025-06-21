export type Assessment = {
  _id: string;
  name: string;
  topic: string;
  description: string;
  teacher: string;
  sections: string[];
  questions: AssessmentQuestion[];
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type AssessmentQuestion = {
  question: string;
  points: number;
  choices: string[];
  answer: string;
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
