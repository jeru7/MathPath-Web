export interface TopicPrediction {
  topic: string;
  stage: number;
  currentCompletion: number;
  currentCorrectness: number;
  predictedCompletion: number;
  predictedCorrectness: number;
  trend: "improving" | "declining" | "stable";
  confidence: "high" | "medium" | "low";
}

export interface TopicPredictionResponse {
  predictions: TopicPrediction[];
  topicsAnalyzed: number;
  lastUpdated: Date;
}
