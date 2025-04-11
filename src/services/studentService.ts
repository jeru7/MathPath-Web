import axios from "axios";
import { StudentType } from "../types/student";

const URL = import.meta.env.VITE_BACKEND_TEST_URI;

export const addStudent = async (student: StudentType) => {
  try {
    const res = await axios.post(`${URL}/api/web/students/add`, {
      student,
    });

    return res.data.message;
  } catch (error) {
    console.error(error);
  }
};
