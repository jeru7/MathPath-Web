import { Assessment } from "./../assessment/assessment.type";
import { Stage } from "./../stage/stage.type";

export type ProgressType = "Assessment" | "Stage";

export type BaseTracker = {
  count: number;
  completedCount: number;
  completedPercentage: number;
};

export type AssessmentTracker = BaseTracker & {
  pending: Assessment[];
};

export type StageTracker = BaseTracker & {
  latest: Stage;
};
