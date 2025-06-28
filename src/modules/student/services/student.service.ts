import axios from "axios";
import * as studentType from "../../core/types/student/student.types";
import { URL } from "../../core/utils/mode.utils";

// create student
export const createStudentService = async (
  studentData: studentType.StudentFormData,
) => {
  const res = await axios.post(`${URL}/api/web/students/`, studentData);

  return res.data;
};

// get specific student using student id
export const getStudent = async (
  studentId: string,
): Promise<studentType.Student> => {
  const res = await axios.get(`${URL}/api/web/students/${studentId}`);

  return res.data.data;
};

// get raw student attempts data using student id
export const getStudentAttempts = async (studentId: string) => {
  const res = await axios.get(`${URL}/api/web/students/${studentId}/attempt`);

  return res.data.data;
};

// get student progress log data using student id
export const getStudentProgressLog = async (studentId: string) => {
  const res = await axios.get(
    `${URL}/api/web/students/${studentId}/progress-log`,
  );

  return res.data.data;
};
