export interface IAssessment {
  _id: string;
  name: string;
  topic: string;
  description: string;
  teacher: string;
  sections: string[];
  questions: IQuestion[];
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuestion {
  question: string;
  points: number;
  choices: string[];
  answer: string;
}

export interface ICreateAssessment {
  name: string;
  topic: string;
  description: string;
  teacher: string;
  sections: string[];
  questions: IQuestion[];
  deadline: Date;
}
