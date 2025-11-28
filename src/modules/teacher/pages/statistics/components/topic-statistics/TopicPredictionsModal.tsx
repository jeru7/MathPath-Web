import { type ReactElement } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTeacherTopicPredictions } from "@/modules/teacher/services/teacher-stats.service";
import { useAdminTopicPredictions } from "@/modules/admin/services/admin-stats.service";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiMinus,
  FiTarget,
  FiLayers,
  FiBarChart2,
} from "react-icons/fi";

interface TopicPredictionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType: "admin" | "teacher";
  userId: string;
}

export default function TopicPredictionsModal({
  isOpen,
  onClose,
  userType,
  userId,
}: TopicPredictionsModalProps): ReactElement {
  const useTopicPredictions =
    userType === "teacher"
      ? useTeacherTopicPredictions
      : useAdminTopicPredictions;

  const { data: topicPredictions, isLoading } = useTopicPredictions(userId);
  const predictions = topicPredictions?.predictions || [];
  const topicsAnalyzed = topicPredictions?.topicsAnalyzed || 0;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <FiTrendingUp className="text-green-600" size={16} />;
      case "declining":
        return <FiTrendingDown className="text-red-600" size={16} />;
      default:
        return <FiMinus className="text-gray-500" size={16} />;
    }
  };

  const getConfidenceDisplay = (confidence: string) => {
    switch (confidence) {
      case "high":
        return {
          label: "High Confidence",
          className: "bg-green-100 text-green-800 border-green-200",
        };
      case "medium":
        return {
          label: "Medium Confidence",
          className: "bg-amber-100 text-amber-800 border-amber-200",
        };
      case "low":
        return {
          label: "Low Confidence",
          className: "bg-red-50 text-red-700 border-red-200",
        };
      default:
        return {
          label: "Unknown",
          className: "bg-gray-100 text-gray-700 border-gray-200",
        };
    }
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="h-screen w-screen max-w-none m-0 rounded-none sm:max-w-4xl sm:max-h-[80vh] sm:rounded-lg">
          <DialogHeader className="px-4 sm:px-6">
            <DialogTitle>Topic Predictions</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-48">
            <p className="text-muted-foreground">Loading predictions...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-screen w-screen max-w-none m-0 rounded-none flex flex-col sm:max-w-5xl sm:max-h-[80vh] sm:rounded-lg">
        <DialogHeader className="px-4 sm:px-6 flex-shrink-0 pt-6 pb-4">
          <div className="flex items-start space-x-3">
            {/* Icon hidden on mobile, shown on sm and up */}
            <div className="p-2 bg-blue-100 rounded-lg hidden sm:block flex-shrink-0">
              <FiBarChart2 className="text-blue-600" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-bold text-left">
                Topic Performance Predictions
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1 text-left">
                {topicsAnalyzed > 0
                  ? `Based on ${topicsAnalyzed} topics analyzed • 2-week projections`
                  : "No topic data available for predictions"}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4">
          {predictions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center p-6">
              <FiBarChart2 className="text-gray-300 mb-4" size={48} />
              <p className="text-gray-500 text-lg font-medium mb-2">
                No predictions available
              </p>
              <p className="text-gray-400 text-sm max-w-sm">
                Topic predictions will appear here once students start
                completing stages and generating performance data.
              </p>
            </div>
          ) : (
            <div className="space-y-4 pb-4">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {predictions.map((prediction) => {
                  const confidenceConfig = getConfidenceDisplay(
                    prediction.confidence,
                  );

                  return (
                    <Card
                      key={`${prediction.topic}-${prediction.stage}`}
                      className="border rounded-lg shadow-sm"
                    >
                      <CardHeader className="p-4 border-b">
                        <div className="flex items-start justify-between space-x-2">
                          <CardTitle className="text-sm font-semibold leading-tight flex-1 min-w-0">
                            {prediction.topic}
                          </CardTitle>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <div className="text-xs whitespace-nowrap border px-2 py-0.5 rounded">
                              Stage {prediction.stage}
                            </div>
                            <div
                              className={`text-xs border px-2 py-0.5 rounded ${confidenceConfig.className}`}
                            >
                              {confidenceConfig.label}
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="p-4 space-y-3 text-sm">
                        <div className="space-y-2 pb-2 border-b">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 min-w-0 flex-1">
                              <FiTarget
                                className="text-muted-foreground flex-shrink-0"
                                size={14}
                              />
                              <span className="font-medium text-muted-foreground truncate">
                                Current Completion:
                              </span>
                            </div>
                            <span className="font-semibold flex-shrink-0">
                              {prediction.currentCompletion}%
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 min-w-0 flex-1">
                              <FiLayers
                                className="text-muted-foreground flex-shrink-0"
                                size={14}
                              />
                              <span className="font-medium text-muted-foreground truncate">
                                Current Correctness:
                              </span>
                            </div>
                            <span className="font-semibold flex-shrink-0">
                              {prediction.currentCorrectness}%
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 pb-2 border-b">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 min-w-0 flex-1">
                              <FiTarget
                                className="text-blue-500 flex-shrink-0"
                                size={14}
                              />
                              <span className="font-medium text-muted-foreground truncate">
                                Predicted Completion:
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 flex-shrink-0">
                              <span
                                className={`font-semibold ${prediction.predictedCompletion >
                                  prediction.currentCompletion
                                  ? "text-green-600"
                                  : prediction.predictedCompletion <
                                    prediction.currentCompletion
                                    ? "text-red-600"
                                    : "text-gray-600"
                                  }`}
                              >
                                {prediction.predictedCompletion}%
                              </span>
                              {prediction.predictedCompletion >
                                prediction.currentCompletion && (
                                  <FiTrendingUp
                                    className="text-green-600"
                                    size={12}
                                  />
                                )}
                              {prediction.predictedCompletion <
                                prediction.currentCompletion && (
                                  <FiTrendingDown
                                    className="text-red-600"
                                    size={12}
                                  />
                                )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 min-w-0 flex-1">
                              <FiLayers
                                className="text-blue-500 flex-shrink-0"
                                size={14}
                              />
                              <span className="font-medium text-muted-foreground truncate">
                                Predicted Correctness:
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 flex-shrink-0">
                              <span
                                className={`font-semibold ${prediction.predictedCorrectness >
                                  prediction.currentCorrectness
                                  ? "text-green-600"
                                  : prediction.predictedCorrectness <
                                    prediction.currentCorrectness
                                    ? "text-red-600"
                                    : "text-gray-600"
                                  }`}
                              >
                                {prediction.predictedCorrectness}%
                              </span>
                              {prediction.predictedCorrectness >
                                prediction.currentCorrectness && (
                                  <FiTrendingUp
                                    className="text-green-600"
                                    size={12}
                                  />
                                )}
                              {prediction.predictedCorrectness <
                                prediction.currentCorrectness && (
                                  <FiTrendingDown
                                    className="text-red-600"
                                    size={12}
                                  />
                                )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 min-w-0 flex-1">
                              <FiBarChart2
                                className="text-muted-foreground flex-shrink-0"
                                size={14}
                              />
                              <span className="font-medium text-muted-foreground truncate">
                                Performance Trend:
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 flex-shrink-0">
                              {getTrendIcon(prediction.trend)}
                              <span className="font-medium capitalize whitespace-nowrap">
                                {prediction.trend}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h4 className="font-semibold text-sm mb-3">
                      Performance Trends
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <FiTrendingUp className="text-green-600" size={14} />
                        <span className="text-sm text-muted-foreground">
                          Improving - Expected to get better
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FiTrendingDown className="text-red-600" size={14} />
                        <span className="text-sm text-muted-foreground">
                          Declining - May need intervention
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FiMinus className="text-gray-500" size={14} />
                        <span className="text-sm text-muted-foreground">
                          Stable - Consistent performance
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-3">
                      Confidence Levels
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-600 rounded-full flex-shrink-0"></div>
                        <span className="text-sm text-muted-foreground">
                          <span className="font-medium">High</span> - Based on
                          4+ weeks of consistent data
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-amber-500 rounded-full flex-shrink-0"></div>
                        <span className="text-sm text-muted-foreground">
                          <span className="font-medium">Medium</span> - Based on
                          3+ weeks of data
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-600 rounded-full flex-shrink-0"></div>
                        <span className="text-sm text-muted-foreground">
                          <span className="font-medium">Low</span> - Limited
                          data available
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-muted-foreground text-center">
                    Predictions based on current performance trends, learning
                    patterns, and historical data analysis.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
