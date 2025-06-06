import { IAssessment } from "./assessment.type";
import { IGameLevel } from "./gamelevel.type";

export enum titleEnum {
  Assessment = "Assessment",
  Stage = "Stage",
}

interface Tracker {
  count: number;
  completedCount: number;
  completedPercentage: number;
}

export interface IAssessmentTracker extends Tracker {
  pending: IAssessment[];
}

export interface IStagesTracker extends Tracker {
  latest: IGameLevel;
}
