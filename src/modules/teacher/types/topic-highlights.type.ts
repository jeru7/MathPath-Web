export type TopicHighlights = {
  highest: {
    title: string;
    stage: number;
    attempts: number;
    correctness: number;
  };
  lowest: {
    title: string;
    stage: number;
    attempts: number;
    correctness: number;
  };
  hasData: boolean;
};
