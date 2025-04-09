export type Section = {
  _id: string;
  name: string;
  teachers: string[];
  students: string[];
  assessments: string[];
  color: SectionColor;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type AddSection = {
  name: string;
  teachers: string[];
  color: SectionColor;
  students?: string[];
  assessments?: string[];
};

export type SectionColor =
  | "primary-green"
  | "tertiary-green"
  | "primary-orange"
  | "primary-yellow";
