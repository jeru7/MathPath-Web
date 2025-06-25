export type ActiveStudents = {
  totalPercentage: number;
  sections: ActiveStudentsSections[];
};

export type ActiveStudentsSections = {
  name: string;
  percentage: number;
};
