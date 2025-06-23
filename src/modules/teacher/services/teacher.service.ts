import axios from "axios";

import { Teacher } from "../types/teacher/teacher.types";
import { Student } from "../types/student/student.types";
import { Section } from "../types/section/section.types";
import { Assessment } from "../types/assessment/assessment.types";

import { URL } from "../utils/mode.utils";

export const getTeacherById = async (teacherId: string) => {
  try {
    const res = await axios.get<{ data: Teacher | null }>(
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
    const res = await axios.get<{ data: Teacher[] | null }>(
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
    const res = await axios.get<{ data: Student[] | null }>(
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
    const res = await axios.get<{ data: Section[] | null }>(
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
    const res = await axios.get<{ data: Assessment[] | null }>(
      `${URL}/api/web/teachers/${teacherId}/assessments`,
    );

    return res.data.data ?? [];
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch assessments.");
  }
};
