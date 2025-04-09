import axios from "axios";
import { SectionColor } from "../types/section";

const URL = import.meta.env.VITE_BACKEND_TEST_URI;

export const addSection = async (
  name: string,
  teachers: string[],
  color: SectionColor,
  students?: string[],
  assessments?: string[],
) => {
  try {
    const res = await axios.post(`${URL}/api/web/sections/create`, {
      name,
      teachers,
      students,
      assessments,
      color,
    });

    return res.data.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed in creating section.");
  }
};
