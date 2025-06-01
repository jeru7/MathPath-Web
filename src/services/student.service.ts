import axios from "axios";
import { StudentFormData } from "../types/student.type";
import { URL } from "../utils/mode.utils";

export const createStudentService = async (studentData: StudentFormData) => {
  const res = await axios.post(`${URL}/api/web/students/`, studentData);
  return res.data;
};

export const getStudent = async (studentId: string) => {
  const res = await axios.get(`${URL}/api/web/students/${studentId}`);
  return res.data.data;
};

export const getStudentAttempts = async (studentId: string) => {
  const res = await axios.get(`${URL}/api/web/students/${studentId}/attempt`);
  return res.data.data;
};

export const getStudentAttemptStats = async (studentId: string) => {
  const res = await axios.get(
    `${URL}/api/web/students/${studentId}/stats/attempt`,
  );
  return res.data.data;
};

export const getStudentDifficultyFrequency = async (studentId: string) => {
  const res = await axios.get(
    `${URL}/api/web/students/${studentId}/stats/difficulty-frequency`,
  );

  return res.data.data;
};

export const getStudentProgressLogService = async (studentId: string) => {
  const res = await axios.get(
    `${URL}/api/web/students/${studentId}/progress-log`,
  );
  return res.data.data;
};
