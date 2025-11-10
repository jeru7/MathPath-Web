import { useEffect, useState, type ReactElement, useRef } from "react";
import { Section } from "../../../../../core/types/section/section.type";
import SectionItem from "./SectionItem";
import { useAssessmentBuilder } from "../context/assessment-builder.context";
import DatePicker from "react-datepicker";
import "@/modules/core/styles/customDatePicker.css";
import {
  getDeadlineMinTime,
  getScheduleMinTime,
  roundToNext10Minutes,
} from "../utils/assessment-builder.util";
import DatetimePicker from "./DatetimePicker";
import { AnimatePresence, motion } from "framer-motion";
import { useTeacherContext } from "../../../../context/teacher.context";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const { rawSections } = useTeacherContext();
  const { state: assessment, dispatch } = useAssessmentBuilder();

  const [selectedSections, setSelectedSections] = useState<Section[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const hasInitializedDates = useRef(false);

  const handleAddSection = (sectionId: string) => {
    const section = rawSections?.find((s) => s.id === sectionId);
    if (!section) return;

    const newSections = [...selectedSections, section];
    setSelectedSections(newSections);
    dispatch({ type: "UPDATE_SECTION", payload: newSections.map((s) => s.id) });
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
    if (!rawSections || !assessment.sections?.length) return;
    setSelectedSections(
      rawSections.filter((s) =>
        (assessment.sections as string[]).includes(s.id),
      ),
    );
  }, [rawSections, assessment.sections]);

  return (
    <div className="flex flex-col w-full sm:w-fit h-full items-center justify-center gap-2 md:gap-4">
      <AnimatePresence mode="wait">
        <Card className="w-full sm:w-96 border-0 sm:border-1">
          <CardContent className="p-6">
            <form className="w-full flex flex-col gap-6">
              {/* section selector */}
              <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="section-select"
                    className="text-sm font-medium"
                  >
                    Select Sections
                  </Label>
                  <Select onValueChange={handleAddSection}>
                    <SelectTrigger id="section-select">
                      <SelectValue placeholder="Choose a section to add" />
                    </SelectTrigger>
                    <SelectContent>
                      {rawSections?.map((section) => (
                        <SelectItem key={section.id} value={section.id}>
                          {section.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="border border-border rounded-sm w-full">
                  <div className="w-full gap-2 h-56 flex flex-col p-2 overflow-y-auto">
                    {selectedSections.map((section) => (
                      <SectionItem
                        key={section.id}
                        data={section}
                        onDelete={handleDeleteSection}
                      />
                    ))}
                    {selectedSections.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No sections selected
                      </p>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {isValidated && errors.sections && (
                    <motion.div
                      key="section-error"
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
                          {errors.sections}
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* date pickers */}
              <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="startDate" className="text-sm font-medium">
                    Scheduled At
                  </Label>
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
                    portalId="root-portal"
                  />
                </div>

                {startDate && (
                  <motion.div
                    key="end-date-picker"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-2"
                  >
                    <Label htmlFor="endDate" className="text-sm font-medium">
                      Deadline At
                    </Label>
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
                      portalId="root-portal"
                    />
                  </motion.div>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
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
            <Alert variant="destructive">
              <AlertDescription className="text-sm text-center">
                {publishError}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* buttons */}
      <div className="flex flex-col sm:flex-row gap-2 mt-4 w-full sm:w-96">
        {(!isEditMode || assessment.status === "draft") && (
          <Button
            className="w-full sm:flex-1"
            onClick={onPublishAssessment}
            disabled={isPublishPending}
          >
            {isPublishPending ? "Publishing..." : "Publish Assessment"}
          </Button>
        )}

        {/* save & exit button */}
        <Button
          variant={
            isEditMode && assessment.status !== "draft" ? "default" : "outline"
          }
          className="w-full sm:flex-1"
          onClick={onSaveAndExit}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save and Exit"}
        </Button>
      </div>
    </div>
  );
}
