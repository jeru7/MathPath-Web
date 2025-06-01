import axios from "axios";

import { ITeacher } from "../types/teacher.type";
import { IStudent } from "../types/student.type";
import { ISection } from "../types/section.type";
import { IAssessment } from "../types/assessment.type";

import { URL } from "../utils/mode.utils";

export const getTeacherById = async (teacherId: string) => {
  try {
    const res = await axios.get<{ data: ITeacher | null }>(
      `${URL}/api/web/teachers/${teacherId}`,
    );

    return res.data.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch teacher.");
  }
};

export const getTeachers = async () => {
  try {
    const res = await axios.get<{ data: ITeacher[] | null }>(
      `${URL}/api/web/teachers/`,
    );

    return res.data.data ?? [];
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch teachers.");
  }
};

export const getStudentsByTeacherId = async (teacherId: string) => {
  try {
    const res = await axios.get<{ data: IStudent[] | null }>(
      `${URL}/api/web/teachers/${teacherId}/students`,
    );

    return res.data.data ?? [];
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch students.");
  }
};

export const getSectionsByTeacherId = async (teacherId: string) => {
  try {
    const res = await axios.get<{ data: ISection[] | null }>(
      `${URL}/api/web/teachers/${teacherId}/sections`,
    );

    return res.data.data ?? [];
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch sections.");
  }
};

export const getAssessmentsByTeacherId = async (teacherId: string) => {
  try {
    const res = await axios.get<{ data: IAssessment[] | null }>(
      `${URL}/api/web/teachers/${teacherId}/assessments`,
    );

    return res.data.data ?? [];
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch assessments.");
  }
};
