import { useEffect, useState, type ReactElement, useRef } from "react";
import Select from "react-select";
import { getCustomSelectColor } from "../../../../../core/styles/selectStyles";
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
import DatetimePicker from "./DatetimePicker";
import { AnimatePresence, motion } from "framer-motion";
import { useTeacherContext } from "../../../../context/teacher.context";

type PublishProps = {
  isValidated: boolean;
  errors: { [key: string]: string | number[] };
  onPublishAssessment: () => void;
  onSaveAndExit: () => void;
  isPublishPending: boolean;
  isSaving?: boolean;
  publishError?: string | null;
  isEditMode?: boolean;
};

export default function Publish({
  isValidated,
  errors,
  onPublishAssessment,
  onSaveAndExit,
  isPublishPending,
  isSaving = false,
  publishError,
  isEditMode = false,
}: PublishProps): ReactElement {
  const { sections } = useTeacherContext();
  const { state: assessment, dispatch } = useAssessmentBuilder();

  const [selectedSections, setSelectedSections] = useState<Section[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const hasInitializedDates = useRef(false);

  const handleAddSection = (sections: Section[]) => {
    setSelectedSections([...sections]);
    dispatch({ type: "UPDATE_SECTION", payload: sections.map((s) => s.id) });
  };
  const handleDeleteSection = (section: Section) => {
    const newSections = selectedSections.filter((s) => s.id !== section.id);
    setSelectedSections(newSections);
    dispatch({ type: "UPDATE_SECTION", payload: newSections.map((s) => s.id) });
  };

  const handleStartDateChange = (date: Date | null) => {
    if (!date) return;
    const rounded = roundToNext10Minutes(date);
    setStartDate(rounded);
    dispatch({ type: "ADD_START_DATE", payload: rounded });
    const minDeadline = getDeadlineMinTime(rounded, assessment.timeLimit);
    if (!endDate || endDate < minDeadline) {
      setEndDate(minDeadline);
      dispatch({ type: "ADD_END_DATE", payload: minDeadline });
    }
  };
  const handleEndDateChange = (date: Date | null) => {
    if (!date) return;
    const rounded = roundToNext10Minutes(date);
    setEndDate(rounded);
    dispatch({ type: "ADD_END_DATE", payload: rounded });
  };

  useEffect(() => {
    if (hasInitializedDates.current) return;

    if (isEditMode) {
      if (assessment.date.start) {
        const existingStart = new Date(assessment.date.start);
        setStartDate(existingStart);
      }

      if (assessment.date.end) {
        const existingEnd = new Date(assessment.date.end);
        setEndDate(existingEnd);
      }
    } else {
      const now = new Date();
      let roundedStart: Date;

      if (assessment.date.start) {
        const existingStart = new Date(assessment.date.start);
        roundedStart =
          existingStart < now
            ? roundToNext10Minutes(now)
            : roundToNext10Minutes(existingStart);
      } else {
        roundedStart = roundToNext10Minutes(now);
      }

      setStartDate(roundedStart);
      dispatch({ type: "ADD_START_DATE", payload: roundedStart });

      const calculatedEnd = assessment.date.end
        ? new Date(assessment.date.end)
        : getDeadlineMinTime(roundedStart, assessment.timeLimit);

      setEndDate(calculatedEnd);
      dispatch({ type: "ADD_END_DATE", payload: calculatedEnd });
    }

    hasInitializedDates.current = true;
  }, [
    assessment.date.start,
    assessment.date.end,
    assessment.timeLimit,
    dispatch,
    isEditMode,
  ]);

  useEffect(() => {
    if (!sections || !assessment.sections?.length) return;
    setSelectedSections(
      sections.filter((s) => (assessment.sections as string[]).includes(s.id)),
    );
  }, [sections, assessment.sections]);

  return (
    <div className="flex flex-col w-full sm:w-fit h-full items-center justify-center gap-2 md:gap-4">
      <AnimatePresence mode="wait">
        <section className="border rounded-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 h-fit w-full sm:w-96 flex flex-col gap-4 p-4 items-center transition-colors duration-200">
          <form className="w-full flex flex-col gap-4">
            {/* section selector */}
            <div className="flex flex-col gap-2 w-full">
              <Select<Section, true>
                isMulti
                options={sections ?? []}
                value={selectedSections}
                onChange={(selected) => handleAddSection([...(selected ?? [])])}
                getOptionLabel={(s) => s.name}
                getOptionValue={(s) => s.id}
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
                    exit={{ opacity: 0, y: -5, transition: { duration: 0.1 } }}
                  >
                    {errors.sections}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* date pickers */}
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col gap-1">
                <div className="flex flex-col gap-2 h-18">
                  <label
                    htmlFor="startDate"
                    className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200"
                  >
                    Scheduled At
                  </label>
                  <DatePicker
                    id="startDate"
                    selected={startDate}
                    onChange={handleStartDateChange}
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
                    filterTime={(time) => time.getMinutes() % 10 === 0}
                  />
                </div>
              </div>

              {startDate && (
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
                    onChange={handleEndDateChange}
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
                    filterTime={(time) => time.getMinutes() % 10 === 0}
                  />
                </motion.div>
              )}
            </div>
          </form>
        </section>
      </AnimatePresence>

      {/* publish error */}
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

      {/* buttons */}
      <div className="flex flex-col sm:flex-row gap-2 mt-4 w-full sm:w-96">
        {(!isEditMode || assessment.status === "draft") && (
          <button
            className="bg-green-600 dark:bg-green-500 px-4 py-3 rounded-sm w-full sm:flex-1 opacity-80 hover:cursor-pointer hover:opacity-100 transition-all duration-200 disabled:opacity-50"
            onClick={onPublishAssessment}
            type="button"
            disabled={isPublishPending}
          >
            <p className="text-sm md:text-base text-white font-semibold">
              {isPublishPending ? "Publishing..." : "Publish Assessment"}
            </p>
          </button>
        )}

        {/* save & exit button */}
        <button
          className={`${isEditMode && assessment.status !== "draft" ? "w-full bg-green-600 dark:bg-green-500" : "w-full sm:flex-1 bg-gray-600 dark:bg-gray-500"} px-4 py-3 rounded-sm opacity-80 hover:cursor-pointer hover:opacity-100 transition-all duration-200 disabled:opacity-50`}
          onClick={onSaveAndExit}
          type="button"
          disabled={isSaving}
        >
          <p className="text-sm md:text-base text-white font-semibold">
            {isSaving ? "Saving..." : "Save & Exit"}
          </p>
        </button>
      </div>
    </div>
  );
}
