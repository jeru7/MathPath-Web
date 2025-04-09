import axios from "axios";
import { AddSection } from "../types/section";

const URL = import.meta.env.VITE_BACKEND_TEST_URI;

export const addSection = async (sectionData: AddSection) => {
  try {
    console.log(sectionData);
    const res = await axios.post(`${URL}/api/web/sections/create`, sectionData);

    return res.data.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed in creating section.");
  }
};
