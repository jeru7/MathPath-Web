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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

export type BuilderMode = "create" | "configure" | "publish";
export type BuilderStep = 1 | 2 | 3;

export default function AssessmentBuilder(): ReactElement {
  const { teacherId, rawAssessments } = useTeacherContext();
  const { state: assessment } = useAssessmentBuilder();
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isNavigatingAway = useRef(false);
  const popStateHandled = useRef(false);

  const pathSegments = location.pathname.split("/");
  const isEditRoute = pathSegments.includes("edit");
  const isDraftAssessment = assessment.status === "draft";
  const shouldDisableEditingInCreate = isEditRoute && !isDraftAssessment;

  const lastSegment =
    pathSegments[pathSegments.length - (isEditRoute ? 2 : 1)] ?? "create";

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
    const modeMap: Record<BuilderStep, BuilderMode> = {
      1: "create",
      2: "configure",
      3: "publish",
    };
    const currentMode = modeMap[step];

    let targetPath;
    if (isEditRoute) {
      // edit mode urls: /create/edit, /configure/edit, /publish/edit
      targetPath = `/teacher/${teacherId}/assessments/${assessmentId}/${currentMode}/edit`;
    } else {
      // create mode urls: /create, /configure, /publish
      targetPath =
        assessmentId === "new"
          ? `/teacher/${teacherId}/assessments/new/${currentMode}`
          : `/teacher/${teacherId}/assessments/${assessmentId}/${currentMode}`;
    }

    if (teacherId && location.pathname !== targetPath) {
      navigate(targetPath, { replace: true });
    }
  }, [step, navigate, teacherId, assessmentId, location.pathname, isEditRoute]);

  useEffect(() => {
    if (["create", "configure", "publish"].includes(lastSegment)) {
      setStep(getInitialStep(lastSegment as BuilderMode));
    }
  }, [lastSegment]);

  useEffect(() => {
    if (assessmentId === "new" && teacherId && rawAssessments.length > 0) {
      const otherDrafts = rawAssessments.filter(
        (item) => item.status === "draft" && item.id !== assessment.id,
      );
      otherDrafts.forEach((draft) => draft.id && deleteDraft(draft.id));
    }
  }, [assessmentId, teacherId, rawAssessments, deleteDraft, assessment.id]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !isNavigatingAway.current) {
        event.preventDefault();
        event.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
        return event.returnValue;
      }
    };

    const handlePopState = (event: PopStateEvent) => {
      if (
        hasUnsavedChanges &&
        !isNavigatingAway.current &&
        !popStateHandled.current
      ) {
        event.preventDefault();
        popStateHandled.current = true;

        console.log("Back button pressed - showing confirmation modal");
        setShowExitConfirm(true);

        const pushState = () => {
          window.history.pushState(null, "", window.location.href);
        };

        pushState();
        setTimeout(pushState, 10);
        setTimeout(pushState, 20);
        setTimeout(pushState, 30);

        setTimeout(() => {
          popStateHandled.current = false;
        }, 100);
      }
    };

    window.history.pushState(null, "", window.location.href);

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
    isNavigatingAway.current = true;

    updateDraft(assessment, {
      onSuccess: () => {
        setHasUnsavedChanges(false);
        setIsSaving(false);
        setShowExitConfirm(false);
        navigate("..");
      },
      onError: () => {
        setIsSaving(false);
        isNavigatingAway.current = false;
      },
    });
  };

  const handleExitWithoutSave = () => {
    setShowExitConfirm(false);
    setHasUnsavedChanges(false);
    isNavigatingAway.current = true;
    navigate("..");
  };

  const handleCancelExit = () => {
    setShowExitConfirm(false);
    isNavigatingAway.current = false;
    window.history.pushState(null, "", window.location.href);
  };

  const handleBackClick = () => {
    if (hasUnsavedChanges) {
      setShowExitConfirm(true);
    } else {
      isNavigatingAway.current = true;
      navigate("..");
    }
  };

  const handlePreview = () => {
    if (!assessment.title || assessment.pages.length === 0)
      return toast.warn("Cannot preview: Assessment needs title.");
    openPreview(assessment, "preview");
  };

  const handleStepChange = (newStep: BuilderStep) => {
    setStep(newStep);
  };

  useEffect(() => () => cancelPendingUpdates(), []);

  return (
    <main className="flex min-h-screen w-full flex-col gap-4 bg-background p-4 h-fit mt-8 md:mt-0">
      {showSaveToast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <Card className="min-w-64 border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${isSaving ? "bg-yellow-500 animate-pulse" : "bg-green-500"
                    }`}
                ></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {isSaving ? "Saving changes..." : "All changes saved"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isSaving
                      ? "Auto-saving your progress"
                      : "Your work has been saved"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSaveToast(false)}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                >
                  ×
                </Button>
              </div>
            </CardContent>
          </Card>
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

      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-2xl font-bold">
            {isEditRoute ? "Edit Assessment" : "Create Assessment"}
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && !isSaving && (
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800"
              >
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse mr-0 sm:mr-2"></div>
                <p className="hidden sm:block">Unsaved changes</p>
              </Badge>
            )}
            {isSaving && (
              <Badge
                variant="outline"
                className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800"
              >
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse mr-0 sm:mr-2"></div>
                <p className="hidden sm:block">Saving</p>
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-0">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center relative">
            <Button
              variant="outline"
              className="w-fit self-start sm:absolute left-0 top-1/2 sm:-translate-y-1/2"
              onClick={handleBackClick}
            >
              Back
            </Button>

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

              <Button
                variant="ghost"
                size="sm"
                onClick={handlePreview}
                className="absolute flex gap-2 items-center right-0 -top-12 sm:-right-32 sm:top-1/2 sm:-translate-y-1/2"
              >
                <FaEye className="w-4 h-4" />
                <span className="text-sm">Preview</span>
              </Button>
            </div>
          </div>

          {publishError && (
            <Alert variant="destructive">
              <AlertDescription>{publishError}</AlertDescription>
            </Alert>
          )}

          <Card className="border">
            <CardContent className="p-2 sm:p-4 md:p-6 flex justify-center">
              {step === 1 ? (
                <Create
                  isValidated={isValidated}
                  errors={createErrors}
                  isEditMode={shouldDisableEditingInCreate}
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
                  isEditMode={isEditRoute}
                />
              ) : null}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </main>
  );
}
