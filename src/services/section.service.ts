import axios from "axios";
import { IAddSection } from "../types/section.type";

// import.meta.env.MODE = "production";

const URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_PROD_URI
    : import.meta.env.VITE_BACKEND_DEV_URI;

export const addSection = async (sectionData: IAddSection) => {
  try {
    console.log(sectionData);
    const res = await axios.post(`${URL}/api/web/sections/create`, sectionData);

    return res.data.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed in creating section.");
  }
};














