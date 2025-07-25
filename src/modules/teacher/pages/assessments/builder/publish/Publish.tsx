import { useState, type ReactElement } from "react";
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
} from "../utils/assessment-builder.utils";
import DatetimePicker from "./DatetimePicker";
import { useTeacherSections } from "../../../../services/teacher.service";
import { AnimatePresence, motion } from "framer-motion";
import { useAddAssessment } from "../../../../../core/services/assessments/assessment.service";
import { toast } from "react-toastify";

export default function Publish(): ReactElement {
  // params
  const { teacherId } = useParams();

  // context
  const { data: sections } = useTeacherSections(teacherId ?? "");

  // reducer
  const { state: assessment, dispatch } = useAssessmentBuilder();

  // query
  const { mutate } = useAddAssessment(teacherId ?? "");

  // states
  const [selectedSections, setSelectedSections] = useState<Section[]>([]);
  const [scheduledAt, setScheduledAt] = useState<Date | null>(null);
  const [deadlineAt, setDeadlineAt] = useState<Date | null>(null);

  // methods
  // const getTeacherSection = (sectionId: )

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

    const sectionIds = selectedSections.map((section) => section.id);

    dispatch({ type: "UPDATE_SECTION", payload: sectionIds });
  };

  const handleStartDateChange = (date: Date | null) => {
    if (!date) return;
    setScheduledAt(date);
    dispatch({ type: "ADD_START_DATE", payload: date });
  };

  const handleEndDateChange = (date: Date | null) => {
    if (!date) return;
    setDeadlineAt(date);
    dispatch({ type: "ADD_END_DATE", payload: date });
  };

  const handleSubmit = () => {
    if (assessment.topic?.trim().length === 0) {
      toast.error("Please provide a topic.");
    }

    if (assessment.title?.trim().length === 0) {
      toast.error("Please provide a title.");
    }

    if (assessment.description?.trim().length === 0) {
      toast.error("Please provide a description.");
    }

    if (assessment.sections.length === 0) {
      toast.error("Please select at least 1 section.");
    }

    mutate(assessment);
  };

  return (
    <div className="flex flex-col w-fit h-full items-center justify-center gap-4">
      <section className="border rounded-sm border-gray-300 bg-white h-fit w-96 flex flex-col gap-4 p-4 items-center">
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
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
                justifyContent: "flex-start",
              })}
              isSearchable={false}
              className="w-full"
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
          </div>

          <div className="flex flex-col gap-4 w-full">
            {/* Scheduled */}
            <div className="flex flex-col gap-2 h-18 ">
              <label htmlFor="scheduledAt" className="font-semibold">
                Scheduled At
              </label>
              <DatePicker
                id="scheduledAt"
                selected={scheduledAt}
                onChange={(date) => handleStartDateChange(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm"
                customInput={
                  <DatetimePicker value={scheduledAt} label="Scheduled at" />
                }
                minDate={scheduledAt || new Date()}
                minTime={getScheduleMinTime(scheduledAt)}
                maxTime={new Date(0, 0, 0, 23, 45)}
              />
            </div>

            {/* Deadline */}
            {scheduledAt ? (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 100, y: 0 }}
                  className="flex flex-col gap-2 h-18"
                >
                  <label htmlFor="deadlineAt" className="font-semibold">
                    Deadline At
                  </label>
                  <DatePicker
                    id="deadlineAt"
                    selected={deadlineAt}
                    onChange={(date) => handleEndDateChange(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="yyyy-MM-dd HH:mm"
                    customInput={
                      <DatetimePicker value={deadlineAt} label="Deadline at" />
                    }
                    minDate={scheduledAt}
                    minTime={getDeadlineMinTime(
                      scheduledAt,
                      deadlineAt,
                      assessment.timeLimit,
                    )}
                    maxTime={new Date(0, 0, 0, 23, 45)}
                  />
                </motion.div>
              </AnimatePresence>
            ) : null}
          </div>
        </form>
      </section>
      <button
        className="bg-[var(--primary-green)] px-4 py-3 rounded-sm w-full opacity-80 hover:cursor-pointer hover:opacity-100 transition-all duration-200"
        type="submit"
      >
        <p className="text-white font-semibold">Create Assessment</p>
      </button>
    </div>
  );
}
