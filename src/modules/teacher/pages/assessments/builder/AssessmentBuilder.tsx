import { useEffect, useRef, useState, type ReactElement } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "../../../../core/styles/customDatePopper.css";
import Stepper from "./components/Stepper";
import Create from "./create/Create";
import Configure from "./configure/Configure";
import Publish from "./publish/Publish";
import { FaEye } from "react-icons/fa";
import { useAssessmentBuilder } from "./context/assessment-builder.context";
import { useAssessmentValidation } from "./hooks/useAssessmentValidation";
import { Assessment } from "../../../../core/types/assessment/assessment.type";
import debounce from "lodash.debounce";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getInitialStep } from "./utils/assessment-builder.util";
import {
  usePublishAssessment,
  useUpdateAssessmentDraft,
  useDeleteAssessment,
} from "../../../services/teacher-assessment.service";
import { useTeacherAssessments } from "../../../services/teacher.service";

export type BuilderMode = "create" | "configure" | "publish";
export type BuilderStep = 1 | 2 | 3;

export default function AssessmentBuilder(): ReactElement {
  const { teacherId, assessmentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const lastSegment = location.pathname.split("/").pop() ?? "create";

  // states
  const [step, setStep] = useState<BuilderStep>(
    ["create", "configure", "publish"].includes(lastSegment)
      ? getInitialStep(lastSegment as BuilderMode)
      : 1,
  );
  const { state: assessment } = useAssessmentBuilder();
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [showBackConfirm, setShowBackConfirm] = useState(false);

  // queries
  const { mutate: publishAssessment, isPending: isPublishPending } =
    usePublishAssessment(assessment.teacher ?? "");
  const { mutate: updateDraft } = useUpdateAssessmentDraft(
    assessment.teacher ?? "",
  );
  const { mutate: deleteDraft } = useDeleteAssessment(assessment.teacher ?? "");
  const { data: assessments = [] } = useTeacherAssessments(teacherId ?? "");

  const [saving, setSaving] = useState(false);

  // refs
  const hasMounted = useRef(false);
  const prevAssessmentRef = useRef<string>();
  const savingTimeoutRef = useRef<number>();

  const debouncedUpdate = useRef(
    debounce((updatedAssessment: Assessment) => {
      console.log("Auto-saving assessment...");
      setIsSaving(true);
      setShowSaveToast(true);

      updateDraft(updatedAssessment, {
        onSuccess: () => {
          console.log("Auto-save successful");
          setIsSaving(false);
          // show toast
          savingTimeoutRef.current = window.setTimeout(() => {
            setShowSaveToast(false);
          }, 2000);
        },
        onError: (error) => {
          console.error("Auto-save failed:", error);
          setIsSaving(false);
          setShowSaveToast(false);
        },
      });
    }, 2000),
  );

  // cancel pending updates
  const cancelPendingUpdates = () => {
    debouncedUpdate.current.cancel();
    if (savingTimeoutRef.current) {
      clearTimeout(savingTimeoutRef.current);
    }
    setIsSaving(false);
    setShowSaveToast(false);
  };

  // side effects
  useEffect(() => {
    const modeMap: Record<BuilderStep, BuilderMode> = {
      1: "create",
      2: "configure",
      3: "publish",
    };

    const currentMode = modeMap[step];
    const currentPath = location.pathname;
    const targetPath = `/teacher/${teacherId}/assessments/${assessmentId}/${currentMode}`;

    if (teacherId && currentPath !== targetPath) {
      navigate(targetPath, {
        replace: true,
      });
    }
  }, [step, navigate, teacherId, assessmentId, location.pathname]);

  useEffect(() => {
    if (["create", "configure", "publish"].includes(lastSegment)) {
      setStep(getInitialStep(lastSegment as BuilderMode));
    }
  }, [lastSegment]);

  // cleanup
  useEffect(() => {
    if (assessmentId === "new" && teacherId && assessments.length > 0) {
      const otherDrafts = assessments.filter(
        (assessmentItem: Assessment) =>
          assessmentItem.status === "draft" &&
          assessmentItem.id !== assessment.id,
      );

      if (otherDrafts.length > 0) {
        otherDrafts.forEach((draft) => {
          if (draft.id) {
            deleteDraft(draft.id, {
              onSuccess: () => {
                console.log(`Cleaned up draft: ${draft.id}`);
              },
              onError: (error) => {
                console.error("Failed to clean up draft:", error);
              },
            });
          }
        });
      }
    }
  }, [assessmentId, teacherId, assessments, deleteDraft, assessment.id]);

  // error trackers
  const createErrors = useAssessmentValidation(assessment, 1);
  const configureErrors = useAssessmentValidation(assessment, 2);
  const publishErrors = useAssessmentValidation(assessment, 3);

  // handlers
  const handlePublishAssessment = () => {
    const hasError =
      Object.keys(createErrors).length > 0 ||
      Object.keys(configureErrors).length > 0 ||
      Object.keys(publishErrors).length > 0;

    setIsValidated(true);
    setPublishError(null);

    if (hasError) return;

    cancelPendingUpdates();

    publishAssessment(assessment, {
      onSuccess: () => {
        setTimeout(() => {
          navigate("..");
        }, 1500);
      },
      onError: (error: unknown) => {
        setPublishError("Failed to publish assessment. Please try again.");
        console.error("Publish error:", error);
      },
    });
  };

  const handleSaveAndExit = () => {
    cancelPendingUpdates();

    setSaving(true);

    updateDraft(assessment, {
      onSuccess: () => {
        setSaving(false);
        navigate("..");
      },
      onError: (error: unknown) => {
        setSaving(false);
        console.error("Save draft error:", error);
      },
    });
  };

  const handleBackClick = () => {
    const meaningfulData = {
      title: assessment.title,
      topic: assessment.topic,
      description: assessment.description,
      sections: assessment.sections,
      pages: assessment.pages,
      passingScore: assessment.passingScore,
      attemptLimit: assessment.attemptLimit,
      date: assessment.date,
      timeLimit: assessment.timeLimit,
    };

    const currentSerialized = JSON.stringify(meaningfulData);

    if (prevAssessmentRef.current !== currentSerialized) {
      setShowBackConfirm(true);
    } else {
      navigate("..");
    }
  };

  const handleBackWithoutSave = () => {
    setShowBackConfirm(false);
    navigate("..");
  };

  useEffect(() => {
    const shouldSkipAutoSave =
      !assessment.id || saving || isPublishPending || !assessment.teacher;

    if (shouldSkipAutoSave) return;

    const meaningfulData = {
      title: assessment.title,
      topic: assessment.topic,
      description: assessment.description,
      sections: assessment.sections,
      pages: assessment.pages,
      passingScore: assessment.passingScore,
      attemptLimit: assessment.attemptLimit,
      date: assessment.date,
      timeLimit: assessment.timeLimit,
    };

    const serialized = JSON.stringify(meaningfulData);

    if (hasMounted.current) {
      if (prevAssessmentRef.current !== serialized) {
        prevAssessmentRef.current = serialized;
        debouncedUpdate.current(assessment);
      }
    } else {
      prevAssessmentRef.current = serialized;
      hasMounted.current = true;
    }
  }, [assessment, saving, isPublishPending]);

  // cleanup
  useEffect(() => {
    return () => {
      cancelPendingUpdates();
    };
  }, []);

  return (
    <main className="flex min-h-screen w-full flex-col gap-2 bg-inherit p-2 h-fit transition-colors duration-200 relative">
      {/* auto-save toast */}
      {showSaveToast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700 min-w-64">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${isSaving ? "bg-yellow-500 animate-pulse" : "bg-green-500"}`}
              ></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {isSaving ? "Saving changes..." : "All changes saved"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {isSaving
                    ? "Auto-saving your progress"
                    : "Your work has been saved"}
                </p>
              </div>
              <button
                onClick={() => setShowSaveToast(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* back confirmation modal */}
      {showBackConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Unsaved Changes
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You have unsaved changes. Do you want to save before exiting?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleBackWithoutSave}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Don't Save
              </button>
              <button
                onClick={() => setShowBackConfirm(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAndExit}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save & Exit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* header */}
      <header className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200">
          Create Assessment
        </h3>

        {/* save status indicator */}
        <div className="flex items-center gap-2">
          {isSaving && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span>Saving...</span>
            </div>
          )}
        </div>
      </header>

      <div className="flex min-h-full h-fit flex-col flex-1">
        <header className="flex flex-col sm:flex-row gap-2 items-center justify-center relative">
          {/* back button */}
          <button
            className="w-fit self-start sm:absolute py-1 px-4 border border-gray-300 dark:border-gray-600 rounded-sm sm:left-0 top-1/2 sm:-translate-y-1/2 opacity-80 hover:cursor-pointer hover:opacity-100 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
            onClick={handleBackClick}
          >
            <p>Back</p>
          </button>

          {/* steppers */}
          <div className="relative w-full sm:w-fit flex justify-center">
            <Stepper
              currentStep={step}
              onChangeStep={(step: BuilderStep) => setStep(step)}
              isValidated={isValidated}
              createErrors={
                Array.isArray(createErrors.emptyPages)
                  ? createErrors.emptyPages.length
                  : 0
              }
              configureErrors={Object.keys(configureErrors).length}
              publishErrors={Object.keys(publishErrors).length}
            />
            <button className="absolute flex gap-2 items-center text-gray-400 dark:text-gray-500 px-4 right-0 -top-8 sm:-right-30 sm:top-1/2 sm:-translate-y-1/2 hover:cursor-pointer hover:text-gray-500 dark:hover:text-gray-400 transition-all duration-200">
              <FaEye />
              <p className="text-xs sm:text-sm">Preview</p>
            </button>
          </div>
        </header>
        <section className="bg-white dark:bg-gray-800 shadow-sm rounded-b-sm sm:rounded-sm p-4 h-fit min-h-full flex-1 flex justify-center border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          {step === 1 ? (
            <Create isValidated={isValidated} errors={createErrors} />
          ) : step === 2 ? (
            <Configure isValidated={isValidated} errors={configureErrors} />
          ) : step === 3 ? (
            <Publish
              isValidated={isValidated}
              errors={publishErrors}
              onPublishAssessment={handlePublishAssessment}
              isPublishPending={isPublishPending}
              publishError={publishError}
            />
          ) : null}
        </section>
      </div>
    </main>
  );
}
