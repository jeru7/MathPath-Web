import { useEffect, useRef, useState, type ReactElement } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Stepper from "./components/Stepper";
import Create from "./create/Create";
import Configure from "./configure/Configure";
import Publish from "./publish/Publish";
import { FaEye } from "react-icons/fa";
import { useAssessmentBuilder } from "./context/assessment-builder.context";
import { useAssessmentValidation } from "./hooks/useAssessmentValidation";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getInitialStep } from "./utils/assessment-builder.util";
import {
  usePublishAssessment,
  useUpdateAssessmentDraft,
  useDeleteAssessment,
} from "../../../services/teacher-assessment.service";
import { usePreview } from "../../../../core/contexts/preview/preview.context";
import AssessmentPreview from "./preview/AssessmentPreview";
import { useTeacherContext } from "../../../context/teacher.context";
import { toast } from "react-toastify";
import ExitBuilderConfirmationModal from "./components/ExitBuilderConfirmationModal";

export type BuilderMode = "create" | "configure" | "publish";
export type BuilderStep = 1 | 2 | 3;

export default function AssessmentBuilder(): ReactElement {
  const { teacherId, assessments } = useTeacherContext();
  const { state: assessment } = useAssessmentBuilder();
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const pathSegments = location.pathname.split("/");
  const isEditMode =
    pathSegments.includes("edit") && assessment.status !== "draft";
  const lastSegment =
    pathSegments[pathSegments.length - (isEditMode ? 2 : 1)] ?? "create";

  const [step, setStep] = useState<BuilderStep>(
    ["create", "configure", "publish"].includes(lastSegment)
      ? getInitialStep(lastSegment as BuilderMode)
      : 1,
  );
  const [isValidated, setIsValidated] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [changesCount, setChangesCount] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  const { mutate: publishAssessment, isPending: isPublishPending } =
    usePublishAssessment(assessment.teacher ?? "");
  const { mutate: updateDraft } = useUpdateAssessmentDraft(
    assessment.teacher ?? "",
  );
  const { mutate: deleteDraft } = useDeleteAssessment(assessment.teacher ?? "");

  const prevAssessmentRef = useRef<string>();
  const { openPreview } = usePreview();
  const navigationLock = useRef(false);
  const lastStepRef = useRef(step);

  const createErrors = useAssessmentValidation(assessment, 1);
  const configureErrors = useAssessmentValidation(assessment, 2);
  const publishErrors = useAssessmentValidation(assessment, 3);

  useEffect(() => {
    const currentSerialized = JSON.stringify({
      title: assessment.title,
      topic: assessment.topic,
      description: assessment.description,
      sections: assessment.sections,
      pages: assessment.pages,
      passingScore: assessment.passingScore,
      attemptLimit: assessment.attemptLimit,
      date: assessment.date,
      timeLimit: assessment.timeLimit,
    });

    const hasChanges = prevAssessmentRef.current
      ? prevAssessmentRef.current !== currentSerialized
      : false;

    setHasUnsavedChanges(hasChanges);

    if (prevAssessmentRef.current) {
      const prev = JSON.parse(prevAssessmentRef.current);
      const current = JSON.parse(currentSerialized);

      let count = 0;
      Object.keys(prev).forEach((key) => {
        if (JSON.stringify(prev[key]) !== JSON.stringify(current[key])) {
          count++;
        }
      });
      setChangesCount(count);
    }

    if (!prevAssessmentRef.current) {
      prevAssessmentRef.current = currentSerialized;
    }
  }, [assessment]);

  const cancelPendingUpdates = () => { };

  useEffect(() => {
    if (navigationLock.current || hasUnsavedChanges) return;

    const modeMap: Record<BuilderStep, BuilderMode> = {
      1: "create",
      2: "configure",
      3: "publish",
    };
    const currentMode = modeMap[step];

    let targetPath;
    if (isEditMode) {
      targetPath = `/teacher/${teacherId}/assessments/${assessmentId}/${currentMode}/edit`;
    } else {
      targetPath =
        assessmentId === "new"
          ? `/teacher/${teacherId}/assessments/new/${currentMode}`
          : `/teacher/${teacherId}/assessments/${assessmentId}/${currentMode}`;
    }

    if (
      teacherId &&
      location.pathname !== targetPath &&
      step !== lastStepRef.current
    ) {
      navigationLock.current = true;
      navigate(targetPath, { replace: true });

      setTimeout(() => {
        navigationLock.current = false;
      }, 100);
    }

    lastStepRef.current = step;
  }, [
    step,
    navigate,
    teacherId,
    assessmentId,
    location.pathname,
    isEditMode,
    hasUnsavedChanges,
  ]);

  useEffect(() => {
    if (["create", "configure", "publish"].includes(lastSegment)) {
      const newStep = getInitialStep(lastSegment as BuilderMode);
      if (newStep !== step && !navigationLock.current) {
        setStep(newStep);
      }
    }
  }, [lastSegment, step]);

  useEffect(() => {
    if (assessmentId === "new" && teacherId && assessments.length > 0) {
      const otherDrafts = assessments.filter(
        (item) => item.status === "draft" && item.id !== assessment.id,
      );
      otherDrafts.forEach((draft) => draft.id && deleteDraft(draft.id));
    }
  }, [assessmentId, teacherId, assessments, deleteDraft, assessment.id]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
        return event.returnValue;
      }
    };

    const handlePopState = (event: PopStateEvent) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        setShowExitConfirm(true);
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [hasUnsavedChanges]);

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
        setHasUnsavedChanges(false);
        setTimeout(() => navigate(".."), 1500);
      },
      onError: () =>
        setPublishError("Failed to publish assessment. Please try again."),
    });
  };

  const handleSaveAndExit = () => {
    cancelPendingUpdates();
    setIsSaving(true);
    updateDraft(assessment, {
      onSuccess: () => {
        setHasUnsavedChanges(false);
        setIsSaving(false);
        setShowExitConfirm(false);
        navigate("..");
      },
      onError: () => setIsSaving(false),
    });
  };

  const handleExitWithoutSave = () => {
    setShowExitConfirm(false);
    setHasUnsavedChanges(false);
    navigate("..");
  };

  const handleCancelExit = () => {
    setShowExitConfirm(false);
    window.history.pushState(null, "", window.location.href);
  };

  const handleBackClick = () => {
    if (hasUnsavedChanges) {
      setShowExitConfirm(true);
    } else {
      navigate("..");
    }
  };

  const handlePreview = () => {
    if (!assessment.title || assessment.pages.length === 0)
      return toast.warn("Cannot preview: Assessment needs title.");
    openPreview(assessment, "preview");
  };

  const handleStepChange = (newStep: BuilderStep) => {
    if (navigationLock.current) return;
    setStep(newStep);
  };

  useEffect(() => () => cancelPendingUpdates(), []);

  return (
    <main className="flex min-h-screen w-full flex-col gap-2 bg-inherit p-2 h-fit transition-colors duration-200 relative">
      {showSaveToast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700 min-w-64">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${isSaving ? "bg-yellow-500 animate-pulse" : "bg-green-500"
                  }`}
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

      <ExitBuilderConfirmationModal
        isOpen={showExitConfirm}
        onSaveAndExit={handleSaveAndExit}
        onExitWithoutSave={handleExitWithoutSave}
        onCancel={handleCancelExit}
        isSaving={isSaving}
        changesCount={changesCount}
      />

      <AssessmentPreview />
      <header className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200">
          {isEditMode ? "Edit Assessment" : "Create Assessment"}
        </h3>
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && !isSaving && (
            <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <span>Unsaved changes</span>
            </div>
          )}
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
          <button
            className="w-fit self-start sm:absolute py-1 px-4 border border-gray-300 dark:border-gray-600 rounded-sm sm:left-0 top-1/2 sm:-translate-y-1/2 opacity-80 hover:cursor-pointer hover:opacity-100 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
            onClick={handleBackClick}
          >
            <p>Back</p>
          </button>
          <div className="relative w-full sm:w-fit flex justify-center">
            <Stepper
              currentStep={step}
              onChangeStep={handleStepChange}
              isValidated={isValidated}
              createErrors={
                Array.isArray(createErrors.emptyPages)
                  ? createErrors.emptyPages.length
                  : 0
              }
              configureErrors={Object.keys(configureErrors).length}
              publishErrors={Object.keys(publishErrors).length}
            />
            <button
              onClick={handlePreview}
              className="absolute flex gap-2 items-center text-gray-400 dark:text-gray-500 px-4 right-0 -top-8 sm:-right-30 sm:top-1/2 sm:-translate-y-1/2 hover:cursor-pointer hover:text-gray-500 dark:hover:text-gray-400 transition-all duration-200"
            >
              <FaEye />
              <p className="text-xs sm:text-sm">Preview</p>
            </button>
          </div>
        </header>
        <section className="bg-white dark:bg-gray-800 shadow-sm rounded-b-sm sm:rounded-sm p-4 h-fit min-h-full flex-1 flex justify-center border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          {step === 1 ? (
            <Create
              isValidated={isValidated}
              errors={createErrors}
              isEditMode={isEditMode}
            />
          ) : step === 2 ? (
            <Configure isValidated={isValidated} errors={configureErrors} />
          ) : step === 3 ? (
            <Publish
              isValidated={isValidated}
              errors={publishErrors}
              onPublishAssessment={handlePublishAssessment}
              onSaveAndExit={handleSaveAndExit}
              isPublishPending={isPublishPending}
              isSaving={isSaving}
              publishError={publishError}
              isEditMode={isEditMode}
            />
          ) : null}
        </section>
      </div>
    </main>
  );
}
