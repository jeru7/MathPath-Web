export type Student = {
  _id: string;
  studentNumber: string;
  section: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  lastPlayed: string;
  status: "Online" | "Offline";
  createdAt: string | Date;
  updatedAt: string | Date;
};
