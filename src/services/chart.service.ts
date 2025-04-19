import axios from "axios";

const URL = import.meta.env.VITE_BACKEND_TEST_URI;

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
