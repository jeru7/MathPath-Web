import axios from "axios";
import { StudentFormData } from "../types/student";

const URL = import.meta.env.VITE_BACKEND_TEST_URI;

export const createStudentService = async (studentData: StudentFormData) => {
  const res = await axios.post(`${URL}/api/web/students/`, studentData);
  return res.data;
};
