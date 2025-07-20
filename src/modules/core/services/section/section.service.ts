import axios from "axios";
import { CreateSectionDto } from "../../types/section/section.dto";
import { URL } from "../../constants/api.constant";

export const getSection = async (sectionId: string) => {
  const res = await axios.get(`${URL}/api/web/sections/${sectionId}`);
  return res.data.data;
};

export const createSection = async (
  teacherId: string,
  sectionData: CreateSectionDto,
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
