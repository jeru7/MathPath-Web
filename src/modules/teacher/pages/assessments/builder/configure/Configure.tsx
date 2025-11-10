import { useEffect, type ReactElement } from "react";
import { useAssessmentBuilder } from "../context/assessment-builder.context";
import { getTotalScore } from "../utils/assessment-builder.util";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NumberInputWithControls } from "@/components/custom/num-input";

type ConfigureProps = {
  isValidated: boolean;
  errors: { [key: string]: string | number[] };
};

export default function Configure({
  isValidated,
  errors,
}: ConfigureProps): ReactElement {
  // reducer
  const { state, dispatch } = useAssessmentBuilder();

  // initials
  const totalScore = getTotalScore(state);
  const passingScoreMinLimit =
    totalScore === 0 ? 1 : Math.round(totalScore * 0.5);

  // handlers
  const handleTitleChange = (title: string) => {
    dispatch({ type: "UPDATE_ASSESSMENT_TITLE", payload: title });
  };

  const handleTopicChange = (topic: string) => {
    dispatch({ type: "UPDATE_ASSESSMENT_TOPIC", payload: topic });
  };

  const handleDescriptionChange = (description: string) => {
    dispatch({ type: "UPDATE_ASSESSMENT_DESCRIPTION", payload: description });
  };

  const handlePassingScoreChange = (passingScore: number) => {
    if (isNaN(passingScore)) return;

    const validatedScore = Math.max(
      passingScoreMinLimit,
      Math.min(passingScore, totalScore === 0 ? 1 : totalScore),
    );

    dispatch({
      type: "UPDATE_ASSESSMENT_PASSING_SCORE",
      payload: validatedScore,
    });
  };

  const handleTimeLimitChange = (timeLimit: number) => {
    if (isNaN(timeLimit)) {
      dispatch({
        type: "UPDATE_ASSESSMENT_TIME_LIMIT",
        payload: 10,
      });
      return;
    }

    const validatedTimeLimit = Math.max(10, Math.min(timeLimit, 50));

    dispatch({
      type: "UPDATE_ASSESSMENT_TIME_LIMIT",
      payload: validatedTimeLimit,
    });
  };

  const handleAttemptLimitChange = (attemptLimit: number) => {
    if (isNaN(attemptLimit)) return;

    const validatedAttemptLimit = Math.max(1, Math.min(attemptLimit, 3));

    dispatch({
      type: "UPDATE_ASSESSMENT_ATTEMPT_LIMIT",
      payload: validatedAttemptLimit,
    });
  };

  useEffect(() => {
    dispatch({
      type: "UPDATE_ASSESSMENT_PASSING_SCORE",
      payload: passingScoreMinLimit,
    });
  }, [dispatch, passingScoreMinLimit]);

  return (
    <div className="flex h-full w-full max-w-4xl items-start justify-center lg:px-8">
      <Card className="w-full border-0 lg:border-1">
        <CardContent className="p-4 sm:p-6">
          <form className="w-full flex flex-col gap-4 sm:gap-6">
            {/* assessment title */}
            <div className="flex flex-col gap-3 sm:gap-4 w-full">
              <Label
                htmlFor="title"
                className="text-sm font-medium sm:min-w-32"
              >
                Title
              </Label>
              <div className="flex-1 flex flex-col gap-2">
                <Input
                  id="title"
                  type="text"
                  value={state.title ?? ""}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter assessment title"
                  className="text-base"
                />
                <AnimatePresence mode="wait">
                  {isValidated && errors.title && (
                    <motion.div
                      key="title-error"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        y: -5,
                        transition: { duration: 0.1 },
                      }}
                    >
                      <Alert variant="destructive" className="py-2">
                        <AlertDescription className="text-sm">
                          {errors.title}
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* assessment topic */}
            <div className="flex flex-col gap-3 sm:gap-4 w-full">
              <Label
                htmlFor="topic"
                className="text-sm font-medium sm:min-w-32"
              >
                Topic
              </Label>
              <div className="flex-1 flex flex-col gap-2">
                <Input
                  id="topic"
                  type="text"
                  value={state.topic ?? ""}
                  onChange={(e) => handleTopicChange(e.target.value)}
                  placeholder="Enter assessment topic"
                  className="text-base"
                />
                <AnimatePresence mode="wait">
                  {isValidated && errors.topic && (
                    <motion.div
                      key="topic-error"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        y: -5,
                        transition: { duration: 0.1 },
                      }}
                    >
                      <Alert variant="destructive" className="py-2">
                        <AlertDescription className="text-sm">
                          {errors.topic}
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* assessment description */}
            <div className="flex flex-col gap-3 sm:gap-4 w-full">
              <Label
                htmlFor="description"
                className="text-sm font-medium sm:min-w-32"
              >
                Description
              </Label>
              <div className="flex-1 flex flex-col gap-2">
                <Textarea
                  id="description"
                  value={state.description ?? ""}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  placeholder="Enter assessment description"
                  className="min-h-32 resize-none text-base"
                />
                <AnimatePresence mode="wait">
                  {isValidated && errors.description && (
                    <motion.div
                      key="description-error"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        y: -5,
                        transition: { duration: 0.1 },
                      }}
                    >
                      <Alert variant="destructive" className="py-2">
                        <AlertDescription className="text-sm">
                          {errors.description}
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="h-px w-full bg-border" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pr-8">
              {/* passing score */}
              <div className="flex w-full items-center gap-4">
                <Label
                  htmlFor="passing-score"
                  className="text-sm font-medium min-w-32 text-right"
                >
                  Passing Score
                </Label>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 items-center">
                    <NumberInputWithControls
                      id="passing-score"
                      value={state.passingScore ?? passingScoreMinLimit}
                      min={passingScoreMinLimit}
                      max={totalScore === 0 ? 1 : totalScore}
                      onChange={handlePassingScoreChange}
                      disabled={totalScore === 0}
                    />
                  </div>
                </div>
              </div>

              {/* attempts limit */}
              <div className="flex items-center gap-4 w-full">
                <Label
                  htmlFor="attempt-limit"
                  className="text-sm font-medium min-w-32 text-right"
                >
                  Attempt Limit
                </Label>
                <div className="flex gap-2 items-center">
                  <NumberInputWithControls
                    id="attempt-limit"
                    value={state.attemptLimit ?? 1}
                    min={1}
                    max={3}
                    onChange={handleAttemptLimitChange}
                    className=""
                  />
                </div>
              </div>
              {/* time limit */}
              <div className="flex items-center gap-4 w-full lg:ml-4">
                <Label
                  htmlFor="time-limit"
                  className="text-sm font-medium min-w-32 text-right"
                >
                  Time Limit{" "}
                  <span className="text-xs text-muted-foreground">
                    [Minutes]
                  </span>
                </Label>
                <div className="flex gap-2 items-center">
                  <NumberInputWithControls
                    id="time-limit"
                    value={state.timeLimit ?? 10}
                    min={10}
                    max={50}
                    onChange={handleTimeLimitChange}
                  />
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
