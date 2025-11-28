import { useEffect, useRef, useState, type ReactElement } from "react";
import AssessmentBuilderProvider from "./context/AssessmentBuilderProvider";
import AssessmentBuilder from "./AssessmentBuilder";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useCreateAssessmentDraft,
  useTeacherAssessment,
} from "../../../services/teacher-assessment.service";
import { PreviewProvider } from "../../../../core/contexts/preview/PreviewProvider";
import { useTeacherContext } from "../../../context/teacher.context";

export default function AssessmentBuilderWrapper(): ReactElement {
  const { teacherId } = useTeacherContext();
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const hasInitialized = useRef(false);
  const navigationInProgress = useRef(false);

  const [draftId, setDraftId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(
    assessmentId && assessmentId !== "new" ? assessmentId : null,
  );

  const assessmentDataId = editId || draftId;

  const { data: assessmentDraft, isFetching } = useTeacherAssessment(
    teacherId,
    assessmentDataId ?? "",
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: !!assessmentDataId && !!teacherId,
    },
  );

  const { mutateAsync } = useCreateAssessmentDraft(teacherId);

  useEffect(() => {
    if (!teacherId || hasInitialized.current || navigationInProgress.current)
      return;

    const initializeAssessment = async () => {
      try {
        navigationInProgress.current = true;
        hasInitialized.current = true;

        if (assessmentId && assessmentId !== "new") {
          console.log("Editing existing assessment:", assessmentId);
          setEditId(assessmentId);
          setDraftId(null);

          const currentPath = location.pathname;
          const isValidEditPath =
            currentPath.includes("/edit") &&
            (currentPath.includes("/create/edit") ||
              currentPath.includes("/configure/edit") ||
              currentPath.includes("/publish/edit"));

          if (!isValidEditPath) {
            navigate(
              `/teacher/${teacherId}/assessments/${assessmentId}/create/edit`,
              {
                replace: true,
              },
            );
          }
        } else {
          console.log("Creating new assessment");
          if (!draftId) {
            const data = await mutateAsync();
            console.log("Created new draft:", data.id);
            localStorage.setItem("currentAssessmentDraftId", data.id);
            setDraftId(data.id);
            setEditId(null);

            const currentPath = location.pathname;
            const isCurrentDraftPath = currentPath.includes(`/${data.id}/`);
            const isValidCreatePath =
              currentPath.includes("/create") ||
              currentPath.includes("/configure") ||
              currentPath.includes("/publish");

            if (!isCurrentDraftPath || !isValidCreatePath) {
              navigate(`/teacher/${teacherId}/assessments/${data.id}/create`, {
                replace: true,
              });
            }
          } else {
            const currentPath = location.pathname;
            const isCurrentDraftPath = currentPath.includes(`/${draftId}/`);
            const isValidPath =
              currentPath.includes("/create") ||
              currentPath.includes("/configure") ||
              currentPath.includes("/publish");

            if (!isCurrentDraftPath || !isValidPath) {
              setEditId(null);
              navigate(`/teacher/${teacherId}/assessments/${draftId}/create`, {
                replace: true,
              });
            }
          }
        }
      } catch (error) {
        console.error("Failed to initialize assessment:", error);
      } finally {
        setTimeout(() => {
          navigationInProgress.current = false;
        }, 100);
      }
    };

    initializeAssessment();
  }, [
    teacherId,
    assessmentId,
    draftId,
    mutateAsync,
    navigate,
    location.pathname,
  ]);

  useEffect(() => {
    return () => {
      if (assessmentId === "new" && draftId) {
        localStorage.removeItem("currentAssessmentDraftId");
      }
    };
  }, [assessmentId, draftId]);

  const isEditMode = Boolean(editId);

  if (isFetching || !assessmentDraft) {
    return <p>Loading {isEditMode ? "assessment" : "draft"}...</p>;
  }

  return (
    <PreviewProvider>
      <AssessmentBuilderProvider
        initialAssessment={assessmentDraft}
        key={assessmentDataId}
      >
        <AssessmentBuilder />
      </AssessmentBuilderProvider>
    </PreviewProvider>
  );
}
