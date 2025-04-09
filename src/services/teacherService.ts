import axios from "axios";
import { Teacher } from "../types/teacher";

const URL = import.meta.env.VITE_BACKEND_TEST_URI;

export const getStudentsByTeacherId = async (teacherId: string) => {
  try {
    const res = await axios.get(
      `${URL}/api/web/teachers/${teacherId}/students`,
    );
    return res.data.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch students.");
  }
};

export const getSectionsByTeacherId = async (teacherId: string) => {
  try {
    const res = await axios.get(
      `${URL}/api/web/teachers/${teacherId}/sections`,
    );
    return res.data.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch sections.");
  }
};

export const getAssessmentsByTeacherId = async (teacherId: string) => {
  try {
    const res = await axios.get(
      `${URL}/api/web/teachers/${teacherId}/assessments`,
    );
    return res.data.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch assessments.");
  }
};

export const getTeachers = async () => {
  try {
    const res = await axios.get(`${URL}/api/web/teachers/`);
    return res.data.data as Teacher[];
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch teachers.");
  }
};
