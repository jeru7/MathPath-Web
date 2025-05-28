import axios from "axios";
import { IAddSection } from "../types/section.type";

// i-comment pag rrun locally for testing
import.meta.env.MODE = "production";

const URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_PROD_URI
    : import.meta.env.VITE_BACKEND_DEV_URI;

export const addSection = async (
  teacherId: string,
  sectionData: IAddSection,
) => {
  try {
    console.log(sectionData);
    const res = await axios.post(
      `${URL}/api/web/teachers/${teacherId}/create`,
      sectionData,
    );

    return res.data.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed in creating section.");
  }
};
