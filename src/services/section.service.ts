import axios from "axios";
import { IAddSection } from "../types/section.type";
import { URL } from "../utils/mode.utils";

export const getSection = async (sectionId: string) => {
  const res = await axios.get(`${URL}/api/web/sections/${sectionId}`);
  return res.data.data;
};

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
