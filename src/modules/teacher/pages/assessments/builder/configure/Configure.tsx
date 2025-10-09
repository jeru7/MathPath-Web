import { useEffect, type ReactElement } from "react";
import { useAssessmentBuilder } from "../context/assessment-builder.context";
import { getTotalScore } from "../utils/assessment-builder.util";
import { AnimatePresence, motion } from "framer-motion";

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
    if (isNaN(timeLimit)) return;

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
    <div className="flex h-full w-full md:w-[800px] items-start justify-center">
      <section className="border rounded-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 h-fit w-full flex flex-col gap-4 p-4 items-center transition-colors duration-200">
        <form className="w-full flex flex-col gap-4">
          {/* assessment title */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 w-full">
            <label
              htmlFor="title"
              className="text-sm md:text-base min-w-32 w-32 md:text-right font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200"
            >
              Title
            </label>
            <input
              type="text"
              name="title"
              value={state.title ?? ""}
              className="text-sm md:text-base border-gray-300 dark:border-gray-600 border rounded-sm outline-none px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
              onChange={(e) => {
                handleTitleChange(e.target.value);
              }}
            />
          </div>
          <AnimatePresence mode="wait">
            {isValidated && errors.title && (
              <motion.p
                className="text-sm text-red-500 dark:text-red-400 self-end transition-colors duration-200"
                key="title-error"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  y: -5,
                  transition: { duration: 0.1 },
                }}
              >
                {errors.title}
              </motion.p>
            )}
          </AnimatePresence>
          {/* assessment topic */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 w-full">
            <label
              htmlFor="topic"
              className="text-sm md:text-base min-w-32 w-32 md:text-right font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200"
            >
              Topic
            </label>
            <input
              type="text"
              name="topic"
              value={state.topic ?? ""}
              className="text-sm md:text-base border-gray-300 dark:border-gray-600 border rounded-sm outline-none px-2 py-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
              onChange={(e) => {
                handleTopicChange(e.target.value);
              }}
            />
          </div>
          <AnimatePresence mode="wait">
            {isValidated && errors.topic && (
              <motion.p
                className="text-sm text-red-500 dark:text-red-400 self-end transition-colors duration-200"
                key="topic-error"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  y: -5,
                  transition: { duration: 0.1 },
                }}
              >
                {errors.topic}
              </motion.p>
            )}
          </AnimatePresence>
          {/* assessment description */}
          <div className="flex flex-col md:flex-row md:items-start gap-2 w-full">
            <label
              htmlFor="description"
              className="text-sm md:text-base min-w-32 w-32 md:text-right font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200"
            >
              Description
            </label>
            <textarea
              name="description"
              value={state.description ?? ""}
              className="text-sm md:text-base border-gray-300 dark:border-gray-600 border rounded-sm outline-none px-2 py-1 w-full min-h-32 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
              onChange={(e) => {
                handleDescriptionChange(e.target.value);
              }}
            />
          </div>
          <AnimatePresence mode="wait">
            {isValidated && errors.description && (
              <motion.p
                className="text-sm text-red-500 dark:text-red-400 self-end transition-colors duration-200"
                key="description-error"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  y: -5,
                  transition: { duration: 0.1 },
                }}
              >
                {errors.description}
              </motion.p>
            )}
          </AnimatePresence>
          <div className="h-[1px] w-full bg-gray-200 dark:bg-gray-600 transition-colors duration-200"></div>
          <div className="w-full flex flex-col sm:flex-row gap-4 md:gap-2 sm:justify-between">
            {/* passing score */}
            <div className="relative flex flex-col md:flex-row md:items-center gap-2 w-fit">
              <label
                htmlFor="description"
                className="text-sm md:text-base min-w-32 w-32 md:text-right font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200"
              >
                Passing Score
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  name="passing-score"
                  className="border-gray-300 dark:border-gray-600 border rounded-sm outline-none px-2 py-1 w-32 resize-none disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                  value={state.passingScore ?? passingScoreMinLimit}
                  min={passingScoreMinLimit}
                  max={totalScore === 0 ? 1 : totalScore}
                  onChange={(e) =>
                    handlePassingScoreChange(Number(e.target.value))
                  }
                  disabled={totalScore === 0}
                />
                {totalScore === 0 ? (
                  <p className="text-sm text-gray-400 dark:text-gray-500 italic transition-colors duration-200">
                    Unavailable
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 dark:text-gray-500 transition-colors duration-200">
                    / {totalScore}
                  </p>
                )}
              </div>
            </div>
            {/* attempts limit */}
            <div className="flex flex-col md:flex-row items-center gap-2 w-fit">
              <label
                htmlFor="description"
                className="text-sm md:text-base min-w-32 w-32 md:text-right font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200"
              >
                Attempt Limit
              </label>
              <input
                type="number"
                name="attempt-limit"
                className="border-gray-300 dark:border-gray-600 border rounded-sm outline-none px-2 py-1 w-32 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                value={state.attemptLimit ?? 1}
                min={1}
                max={3}
                onChange={(e) =>
                  handleAttemptLimitChange(Number(e.target.value))
                }
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-baseline gap-2 w-fit">
            <label
              htmlFor="description"
              className="text-sm md:text-base min-w-32 w-32 md:text-right font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200"
            >
              Time Limit
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                name="time-limit"
                className="border-gray-300 dark:border-gray-600 border rounded-sm outline-none px-2 py-1 w-32 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                value={state.timeLimit ?? 10}
                min={10}
                max={50}
                onChange={(e) => handleTimeLimitChange(Number(e.target.value))}
              />
              <p className="text-sm text-gray-400 dark:text-gray-500 italic transition-colors duration-200">
                minutes
              </p>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
