import { useEffect, useState, type ReactElement, useRef } from "react";
import Select from "react-select";
import { getCustomSelectColor } from "../../../../../core/styles/selectStyles";
import { useParams } from "react-router-dom";
import { Section } from "../../../../../core/types/section/section.type";
import SectionItem from "./SectionItem";
import { useAssessmentBuilder } from "../context/assessment-builder.context";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  getDeadlineMinTime,
  getScheduleMinTime,
  roundToNext10Minutes,
} from "../utils/assessment-builder.util";
import "../../../../../core/styles/customDatePicker.css";
import DatetimePicker from "./DatetimePicker";
import { useTeacherSections } from "../../../../services/teacher.service";
import { AnimatePresence, motion } from "framer-motion";

type PublishProps = {
  isValidated: boolean;
  errors: { [key: string]: string | number[] };
  onPublishAssessment: () => void;
  isPublishPending: boolean;
  publishError?: string | null;
};

export default function Publish({
  isValidated,
  errors,
  onPublishAssessment,
  isPublishPending,
  publishError,
}: PublishProps): ReactElement {
  // params
  const { teacherId } = useParams();

  // context
  const { data: sections } = useTeacherSections(teacherId ?? "");

  // reducer
  const { state: assessment, dispatch } = useAssessmentBuilder();

  // states
  const [selectedSections, setSelectedSections] = useState<Section[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // refs
  const prevStartDateRef = useRef<string | undefined>();
  const hasInitializedDates = useRef(false);

  // handlers
  const handleAddSection = (sections: Section[]) => {
    setSelectedSections([...sections]);

    const sectionIds = sections.map((section) => section.id);
    dispatch({ type: "UPDATE_SECTION", payload: sectionIds });
  };

  const handleDeleteSection = (selectedSection: Section) => {
    const newSections = selectedSections.filter(
      (section) => section.id !== selectedSection.id,
    );
    setSelectedSections(newSections);

    const sectionIds = newSections.map((section) => section.id);

    dispatch({ type: "UPDATE_SECTION", payload: sectionIds });
  };

  const handleStartDateChange = (date: Date | null) => {
    if (!date) return;

    // round to next 10 min interval
    const roundedDate = roundToNext10Minutes(date);
    setStartDate(roundedDate);
    dispatch({ type: "ADD_START_DATE", payload: roundedDate });

    // calculate the minimum allowed deadline
    const minDeadline = getDeadlineMinTime(roundedDate, assessment.timeLimit);

    if (!endDate || endDate < minDeadline) {
      const newEndDate = minDeadline;
      setEndDate(newEndDate);
      dispatch({ type: "ADD_END_DATE", payload: newEndDate });
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    if (!date) return;

    // round to next 10 min interval
    const roundedDate = roundToNext10Minutes(date);
    setEndDate(roundedDate);
    dispatch({ type: "ADD_END_DATE", payload: roundedDate });
  };

  // reset end date when start date changes significantly
  useEffect(() => {
    const currentStartDate = assessment.date.start ?? undefined;
    if (prevStartDateRef.current !== currentStartDate) {
      prevStartDateRef.current = currentStartDate;
    }
  }, [assessment.date.start]);

  // initialize dates only once when component mounts
  useEffect(() => {
    if (hasInitializedDates.current) return;

    const now = new Date();
    let roundedStartDate: Date;

    if (assessment.date.start) {
      const existingStartDate = new Date(assessment.date.start);

      if (existingStartDate < now) {
        // If start date is in past, update to current time
        roundedStartDate = roundToNext10Minutes(now);
        setStartDate(roundedStartDate);
        dispatch({ type: "ADD_START_DATE", payload: roundedStartDate });

        if (!assessment.date.end) {
          const calculatedEndDate = getDeadlineMinTime(
            roundedStartDate,
            assessment.timeLimit,
          );
          setEndDate(calculatedEndDate);
          dispatch({ type: "ADD_END_DATE", payload: calculatedEndDate });
        }
      } else {
        // if start date is in future, use it as is
        roundedStartDate = roundToNext10Minutes(existingStartDate);
        setStartDate(roundedStartDate);
        dispatch({ type: "ADD_START_DATE", payload: roundedStartDate });

        // only set end date if it's not already set
        if (!assessment.date.end) {
          const calculatedEndDate = getDeadlineMinTime(
            roundedStartDate,
            assessment.timeLimit,
          );
          setEndDate(calculatedEndDate);
          dispatch({ type: "ADD_END_DATE", payload: calculatedEndDate });
        } else {
          // use the existing end date
          const existingEndDate = new Date(assessment.date.end);
          setEndDate(existingEndDate);
        }
      }
    } else {
      roundedStartDate = roundToNext10Minutes(now);
      setStartDate(roundedStartDate);
      dispatch({ type: "ADD_START_DATE", payload: roundedStartDate });

      const initialEndDate = getDeadlineMinTime(
        roundedStartDate,
        assessment.timeLimit,
      );
      setEndDate(initialEndDate);
      dispatch({ type: "ADD_END_DATE", payload: initialEndDate });
    }

    hasInitializedDates.current = true;
  }, [
    assessment.date.start,
    assessment.date.end,
    assessment.timeLimit,
    dispatch,
    startDate,
  ]);

  useEffect(() => {
    if (assessment.date.start && !startDate) {
      const existingStartDate = new Date(assessment.date.start);
      setStartDate(roundToNext10Minutes(existingStartDate));
    }

    if (assessment.date.end && !endDate) {
      const existingEndDate = new Date(assessment.date.end);
      setEndDate(roundToNext10Minutes(existingEndDate));
    }
  }, [assessment.date.start, assessment.date.end, startDate, endDate]);

  useEffect(() => {
    if (!sections || !assessment.sections?.length) return;

    const matched = sections.filter((section: Section) =>
      (assessment.sections as string[]).includes(section.id),
    );

    setSelectedSections(matched);
  }, [sections, assessment.sections]);

  return (
    <div className="flex flex-col w-full sm:w-fit h-full items-center justify-center gap-2 md:gap-4">
      <AnimatePresence mode="wait">
        <section className="border rounded-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 h-fit w-full sm:w-96 flex flex-col gap-4 p-4 items-center transition-colors duration-200">
          <form className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-2 w-full">
              {/* section select */}
              <Select<Section, true>
                id="type"
                isMulti
                options={sections ?? []}
                value={selectedSections}
                onChange={(selected) => {
                  handleAddSection([...(selected ?? [])]);
                }}
                getOptionLabel={(section) => section.name}
                getOptionValue={(section) => section.id}
                placeholder="Select sections"
                styles={getCustomSelectColor({
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "white",
                  textColor: "#1f2937",
                  menuWidth: "100%",
                  dark: {
                    backgroundColor: "#374151",
                    textColor: "#f9fafb",
                    borderColor: "#4b5563",
                    borderFocusColor: "#10b981",
                    optionHoverColor: "#1f2937",
                    optionSelectedColor: "#059669",
                    menuBackgroundColor: "#374151",
                    placeholderColor: "#9ca3af",
                  },
                })}
                isSearchable={false}
                className="w-full text-sm sm:text-base"
                controlShouldRenderValue={false}
                isClearable={false}
              />
              {/* section selected list */}
              <section className="bg-inherit border-gray-300 dark:border-gray-600 border rounded-sm w-full transition-colors duration-200">
                <ul className="w-full gap-2 h-56 flex flex-col p-2 overflow-y-auto">
                  {selectedSections.map((section) => (
                    <SectionItem
                      key={section.id}
                      data={section}
                      onDelete={handleDeleteSection}
                    />
                  ))}
                </ul>
              </section>
              <AnimatePresence>
                {isValidated && errors.sections && (
                  <motion.p
                    className="text-sm text-red-500 dark:text-red-400 self-end transition-colors duration-200"
                    key="section-error"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      y: -5,
                      transition: { duration: 0.1 },
                    }}
                  >
                    {errors.sections}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col gap-4 w-full">
              {/* date schedule */}
              <div className="flex flex-col gap-1">
                <div className="flex flex-col gap-2 h-18 ">
                  <label
                    htmlFor="startDate"
                    className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200"
                  >
                    Scheduled At
                  </label>
                  <DatePicker
                    id="startDate"
                    selected={startDate}
                    onChange={(date) => handleStartDateChange(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={10}
                    dateFormat="yyyy-MM-dd HH:mm"
                    customInput={
                      <DatetimePicker value={startDate} label="Scheduled at" />
                    }
                    minDate={new Date()}
                    minTime={getScheduleMinTime(startDate)}
                    maxTime={new Date(0, 0, 0, 23, 50)}
                    // force the time to be on 10 min intervals
                    filterTime={(time) => {
                      const minutes = time.getMinutes();
                      return minutes % 10 === 0;
                    }}
                  />
                </div>
                <AnimatePresence mode="wait">
                  {isValidated && errors.startDate && (
                    <motion.p
                      className="text-sm text-red-500 dark:text-red-400 self-end transition-colors duration-200"
                      key="start-date-error"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        y: -5,
                        transition: { duration: 0.05 },
                      }}
                    >
                      {errors.startDate}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* deadline */}
              {startDate ? (
                <motion.div
                  key="end-date-picker"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-2 h-18"
                >
                  <label
                    htmlFor="endDate"
                    className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200"
                  >
                    Deadline At
                  </label>
                  <DatePicker
                    id="endDate"
                    selected={endDate}
                    onChange={(date) => handleEndDateChange(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={10}
                    dateFormat="yyyy-MM-dd HH:mm"
                    customInput={
                      <DatetimePicker value={endDate} label="Deadline at" />
                    }
                    minDate={startDate}
                    minTime={getScheduleMinTime(endDate)}
                    maxTime={new Date(0, 0, 0, 23, 50)}
                    // force the time to be on 10 min intervals
                    filterTime={(time) => {
                      const minutes = time.getMinutes();
                      return minutes % 10 === 0;
                    }}
                  />
                </motion.div>
              ) : null}
              <AnimatePresence mode="wait">
                {isValidated && errors.endDate && (
                  <motion.p
                    className="text-sm text-red-500 dark:text-red-400 self-end transition-colors duration-200"
                    key="end-date-error"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      y: -5,
                      transition: { duration: 0.05 },
                    }}
                  >
                    {errors.endDate}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </form>
        </section>
      </AnimatePresence>

      {/* error */}
      <AnimatePresence>
        {publishError && (
          <motion.div
            className="w-full sm:w-96"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-sm p-3">
              <p className="text-sm text-red-800 dark:text-red-200 text-center">
                {publishError}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* publish button */}
      <button
        className="bg-green-600 dark:bg-green-500 px-4 py-3 rounded-sm w-full opacity-80 hover:cursor-pointer hover:opacity-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onPublishAssessment}
        type="button"
        disabled={isPublishPending}
      >
        <p className="text-sm md:text-base text-white font-semibold">
          {isPublishPending ? "Publishing..." : "Publish Assessment"}
        </p>
      </button>
    </div>
  );
}
