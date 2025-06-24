import axios from "axios";
import * as studentType from "../../core/types/student/student.types";
import * as progressCardType from "../../core/types/progress_card.types";
import { QuestList } from "../../core/types/quest/quest.types";
import { PlayerCard } from "../../core/types/student/student_stats.types";
import { URL } from "../../core/utils/mode.utils";

// create student
export const createStudentService = async (
  studentData: studentType.StudentFormData,
) => {
  const res = await axios.post(`${URL}/api/web/students/`, studentData);

  return res.data;
};

// get specific student using student id
export const getStudent = async (
  studentId: string,
): Promise<studentType.Student> => {
  const res = await axios.get(`${URL}/api/web/students/${studentId}`);

  return res.data.data;
};

// get raw student attempts data using student id
export const getStudentAttempts = async (studentId: string) => {
  const res = await axios.get(`${URL}/api/web/students/${studentId}/attempt`);

  return res.data.data;
};

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

// get student progress log data using student id
export const getStudentProgressLogService = async (studentId: string) => {
  const res = await axios.get(
    `${URL}/api/web/students/${studentId}/progress-log`,
  );

  return res.data.data;
};

// get student player card stats
export const getStudentPlayerCardStatsService = async (
  studentId: string,
): Promise<PlayerCard> => {
  const res = await axios.get(
    `${URL}/api/web/students/${studentId}/stats/player-card`,
  );

  return res.data.data;
};

// get student quest list tracker
export const getStudentQuestListService = async (
  studentId: string,
): Promise<QuestList> => {
  const res = await axios.get(
    `${URL}/api/web/students/${studentId}/tracker/quest-list`,
  );

  return res.data.data;
};

// get student assessment tracker
export const getAssessmentTrackerService = async (
  studentId: string,
): Promise<progressCardType.AssessmentTracker> => {
  const res = await axios.get(
    `${URL}/api/web/students/${studentId}/tracker/assessment`,
  );

  return res.data.data;
};

// get student stages tracker
export const getStagesTrackerService = async (
  studentId: string,
): Promise<progressCardType.StagesTracker> => {
  const res = await axios.get(
    `${URL}/api/web/students/${studentId}/tracker/stage`,
  );

  return res.data.data;
};
