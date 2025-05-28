import { createContext } from "react";

import { IStudent } from "../types/student.type";

interface StudentContextType {
  student: IStudent | null;
}

export const StudentContext = createContext<StudentContextType>({
  student: null,
});
