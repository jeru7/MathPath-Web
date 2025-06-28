import axios from "axios";
import { URL } from "../../core/utils/mode.utils";
import { PlayerCard } from "../../core/types/student/student_stats.types";
import { QuestList } from "../../core/types/quest/quest.types";
import {
  AssessmentTracker,
  StagesTracker,
} from "../../core/types/progress_card.types";

// get student attempts stats using student id
export const getStudentAttemptStats = async (studentId: string) => {
  const res = await axios.get(
    `${URL}/api/web/students/${studentId}/stats/attempt`,
  );

  return res.data.data;
};

// get student chosen difficulty frequency stats using student id
export const getStudentDifficultyFrequency = async (studentId: string) => {
  const res = await axios.get(
    `${URL}/api/web/students/${studentId}/stats/difficulty-frequency`,
  );

  return res.data.data;
};

// get student player card stats
export const getStudentPlayerCardStats = async (
  studentId: string,
): Promise<PlayerCard> => {
  const res = await axios.get(
    `${URL}/api/web/students/${studentId}/stats/player-card`,
  );

  return res.data.data;
};

// get student quest list tracker
export const getStudentQuestList = async (
  studentId: string,
): Promise<QuestList> => {
  const res = await axios.get(
    `${URL}/api/web/students/${studentId}/tracker/quest-list`,
  );

  return res.data.data;
};

// get student assessment tracker
export const getAssessmentTracker = async (
  studentId: string,
): Promise<AssessmentTracker> => {
  const res = await axios.get(
    `${URL}/api/web/students/${studentId}/tracker/assessment`,
  );

  return res.data.data;
};

// get student stages tracker
export const getStagesTracker = async (
  studentId: string,
): Promise<StagesTracker> => {
  const res = await axios.get(
    `${URL}/api/web/students/${studentId}/tracker/stage`,
  );

  return res.data.data;
};

// get student topic stats
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

// get student question stats
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
