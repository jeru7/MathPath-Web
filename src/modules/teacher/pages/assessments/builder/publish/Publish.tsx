import { useEffect, useState, type ReactElement } from "react";
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
} from "../utils/assessment-builder.util";
import DatetimePicker from "./DatetimePicker";
import { useTeacherSections } from "../../../../services/teacher.service";
import { AnimatePresence, motion } from "framer-motion";

type PublishProps = {
  isValidated: boolean;
  errors: { [key: string]: string | number[] };
  onPublishAssessment: () => void;
  onSaveAssessment: () => void;
  isPublishPending: boolean;
  isSavePending: boolean;
};

export default function Publish({
  isValidated,
  errors,
  onPublishAssessment,
  onSaveAssessment,
  isPublishPending,
  isSavePending,
}: PublishProps): ReactElement {
  // params
  const { teacherId } = useParams();

  // context
  const { data: sections } = useTeacherSections(teacherId ?? "");

  // reducer
  const { state: assessment, dispatch } = useAssessmentBuilder();

  // states
  const [selectedSections, setSelectedSections] = useState<Section[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(
    assessment.date.start ? new Date(assessment.date.start) : null,
  );
  const [endDate, setEndDate] = useState<Date | null>(
    assessment.date.end ? new Date(assessment.date.end) : null,
  );

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
    setStartDate(date);
    dispatch({ type: "ADD_START_DATE", payload: date });

    const newMin = getDeadlineMinTime(date, null, assessment.timeLimit);
    if (!endDate || endDate <= newMin) {
      setEndDate(newMin);
      dispatch({ type: "ADD_END_DATE", payload: newMin });
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    if (!date) return;
    setEndDate(date);
    dispatch({ type: "ADD_END_DATE", payload: date });
  };

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
        <section className="border rounded-sm border-gray-300 bg-white h-fit w-full sm:w-96 flex flex-col gap-4 p-4 items-center">
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
                })}
                isSearchable={false}
                className="w-full text-sm sm:text-base"
                controlShouldRenderValue={false}
                isClearable={false}
              />
              {/* section selected list */}
              <section className="bg-inherit border-gray-300 border rounded-sm w-full">
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
                    className="text-sm text-red-500 self-end"
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
              {/* Scheduled */}
              <div className="flex flex-col gap-1">
                <div className="flex flex-col gap-2 h-18 ">
                  <label
                    htmlFor="startDate"
                    className="text-sm sm:text-base font-semibold"
                  >
                    Scheduled At
                  </label>
                  <DatePicker
                    id="startDate"
                    selected={startDate}
                    onChange={(date) => handleStartDateChange(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="yyyy-MM-dd HH:mm"
                    customInput={
                      <DatetimePicker value={startDate} label="Scheduled at" />
                    }
                    minDate={new Date()}
                    minTime={getScheduleMinTime(startDate)}
                    maxTime={new Date(0, 0, 0, 23, 45)}
                  />
                </div>
                <AnimatePresence mode="wait">
                  {isValidated && errors.startDate && (
                    <motion.p
                      className="text-sm text-red-500 self-end"
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

              {/* Deadline */}
              {startDate ? (
                <motion.div
                  key="end-date-picker"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-2 h-18"
                >
                  <label
                    htmlFor="endDate"
                    className="text-sm sm:text-base font-semibold"
                  >
                    Deadline At
                  </label>
                  <DatePicker
                    id="endDate"
                    selected={endDate}
                    onChange={(date) => handleEndDateChange(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="yyyy-MM-dd HH:mm"
                    customInput={
                      <DatetimePicker value={endDate} label="Deadline at" />
                    }
                    minDate={startDate}
                    minTime={getDeadlineMinTime(
                      startDate,
                      endDate,
                      assessment.timeLimit,
                    )}
                    maxTime={new Date(0, 0, 0, 23, 45)}
                  />
                </motion.div>
              ) : null}
              <AnimatePresence mode="wait">
                {isValidated && errors.endDate && (
                  <motion.p
                    className="text-sm text-red-500 self-end"
                    key="start-date-error"
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
      {/* publish assessment */}
      <button
        className="bg-[var(--primary-green)] px-4 py-3 rounded-sm w-full opacity-80 hover:cursor-pointer hover:opacity-100 transition-all duration-200"
        onClick={onPublishAssessment}
        type="button"
      >
        <p className="text-sm md:text-base text-white font-semibold">
          {isPublishPending ? "Publishing..." : "Publish Assessment"}
        </p>
      </button>

      {/* save as draft */}
      <button
        className={`border px-4 py-3 rounded-sm w-full opacity-60 ${isSavePending ? "opacity-100" : "hover:cursor-pointer hover:opacity-100 transition-all duration-200"}`}
        onClick={onSaveAssessment}
        type="button"
      >
        <p className="text-sm md:text-base text-black font-semibold">
          {isSavePending ? "Saving..." : "Save as Draft"}
        </p>
      </button>
    </div>
  );
}
