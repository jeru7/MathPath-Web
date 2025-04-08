export type StudentLoginResponse = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
};

export type StudentTableItem = {
  id?: string;
  studentNumber: string;
  section: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  lastPlayed: string | Date;
  status: string;
};
