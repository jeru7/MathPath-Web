import axios from "axios";

import { URL } from "../../core/utils/mode.utils";
import { Assessment } from "../../core/types/assessment/assessment.types";
import { Section } from "../../core/types/section/section.types";
import { Teacher } from "../../core/types/teacher/teacher.types";
import { Student } from "../../core/types/student/student.types";

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
