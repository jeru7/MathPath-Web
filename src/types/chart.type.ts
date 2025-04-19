// used for section topic stats
export interface ISectionTopicResponse {
  success: string;
  message: string;
  data: ISectionTopicStats[];
}

export interface ISectionTopicStats {
  sectionId: string;
  sectionName: string;
  topicStats: ITopicStats[];
}

// can be used for student and overall
export interface IStudentTopicResponse {
  success: string;
  message: string;
  data: ITopicStats[];
}

export interface ITopicStats {
  totalAttempts: number;
  topic: string;
  level: number;
  avgTimeSpent: number;
  avgHintUsed: number;
  completionRate: number;
  correctness: ICorrectness;
}

export interface ICorrectness {
  easy: {
    correctPercentage: number;
  };
  medium: {
    correctPercentage: number;
  };
  hard: {
    correctPercentage: number;
  };
}
