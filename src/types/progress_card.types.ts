import { Assessment } from "./assessment/assessment.types";
import { Stage } from "./stage/stage.types";

export type ProgressType = "Assessment" | "Stage";

export type BaseTracker = {
  count: number;
  completedCount: number;
  completedPercentage: number;
};

export type AssessmentTracker = BaseTracker & {
  pending: Assessment[];
};

export type StagesTracker = BaseTracker & {
  latest: Stage;
};
