import axios from "axios";
import { URL } from "../utils/mode.utils";

export const getPerSectionsTopicStats = async (teacherId: string) => {
  try {
    const res = await axios.get(
      `${URL}/api/web/teachers/${teacherId}/topic-stats/per-section`,
    );

    return res.data.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed in fetching topic stats by section.");
  }
};

export const getOverallTopicStats = async (teacherId: string) => {
  try {
    const res = await axios.get(
      `${URL}/api/web/teachers/${teacherId}/topic-stats/overall`,
    );

    return res.data.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed in fetching overall topic stats.");
  }
};

export const getStudentTopicStats = async (studentId: string) => {
  try {
    const res = await axios.get(
      `${URL}/api/web/students/${studentId}/stats/topic`,
    );

    return res.data.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed in fetching student topic stats.");
  }
};

export const getStudentQuestionStats = async (studentId: string) => {
  try {
    const res = await axios.get(
      `${URL}/api/web/students/${studentId}/stats/question`,
    );

    return res.data.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed in fetching student question stats.");
  }
};
