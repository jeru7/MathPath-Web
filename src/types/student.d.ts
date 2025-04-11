export type StudentType = {
  _id: string;
  studentNumber: string;
  section: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  lastPlayed: Date;
  status: "Online" | "Offline";
  createdAt: Date;
  updatedAt: Date;
};
