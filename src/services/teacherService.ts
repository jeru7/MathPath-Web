import axios from "axios";
import { TeacherType } from "../types/teacher";
import { StudentType } from "../types/student";
import { SectionType } from "../types/section";
import { AssessmentType } from "../types/assessment";

const URL = import.meta.env.VITE_BACKEND_TEST_URI;

export const getTeacherById = async (teacherId: string) => {
  try {
    const res = await axios.get<{ data: TeacherType | null }>(
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
    const res = await axios.get<{ data: TeacherType[] | null }>(
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
    const res = await axios.get<{ data: StudentType[] | null }>(
      `${URL}/api/web/teachers/${teacherId}/students`,
    );

    return res.data.data ?? [];
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch students.");
  }
};

export const getOnlineStudentsByTeacherId = async (teacherId: string) => {
  try {
    const res = await axios.get<{ data: StudentType[] | null }>(
      `${URL}/api/web/teachers/${teacherId}/students/online`,
    );

    return res.data.data ?? [];
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch online students.");
  }
};

export const getSectionsByTeacherId = async (teacherId: string) => {
  try {
    const res = await axios.get<{ data: SectionType[] | null }>(
      `${URL}/api/web/teachers/${teacherId}/sections`,
    );

    console.log(res.data);
    return res.data.data ?? [];
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch sections.");
  }
};

export const getAssessmentsByTeacherId = async (teacherId: string) => {
  try {
    const res = await axios.get<{ data: AssessmentType[] | null }>(
      `${URL}/api/web/teachers/${teacherId}/assessments`,
    );

    return res.data.data ?? [];
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch assessments.");
  }
};
