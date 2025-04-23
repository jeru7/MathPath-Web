import axios from "axios";

const URL = import.meta.env.VITE_BACKEND_TEST_URI;

export const getStudentProgressLogService = async (studentId: string) => {
  const res = await axios.get(
    `${URL}/api/web/students/${studentId}/progress-log`,
  );
  return res.data.data;
};



