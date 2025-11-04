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
  const lastPathRef = useRef(location.pathname);

  const [draftId, setDraftId] = useState<string | null>(() => {
    return localStorage.getItem("currentAssessmentDraftId");
  });
  const [editId, setEditId] = useState<string | null>(
    assessmentId && assessmentId !== "new" ? assessmentId : null,
  );

  const assessmentDataId = editId || draftId;

  const { data: assessmentDraft, isFetching } = useTeacherAssessment(
    teacherId,
    assessmentDataId ?? "",
  );

  const { mutateAsync } = useCreateAssessmentDraft(teacherId);

  useEffect(() => {
    if (!teacherId || hasInitialized.current || navigationInProgress.current)
      return;

    if (lastPathRef.current === location.pathname) return;

    lastPathRef.current = location.pathname;
    hasInitialized.current = true;

    const initializeAssessment = async () => {
      navigationInProgress.current = true;

      try {
        if (assessmentId && assessmentId !== "new") {
          setEditId(assessmentId);
          setDraftId(null);
          localStorage.removeItem("currentAssessmentDraftId");

          const currentPath = location.pathname;
          if (!currentPath.includes("/edit")) {
            navigate(
              `/teacher/${teacherId}/assessments/${assessmentId}/create/edit`,
              { replace: true },
            );
          }
        } else {
          if (!draftId) {
            const data = await mutateAsync();
            localStorage.setItem("currentAssessmentDraftId", data.id);
            setDraftId(data.id);
            setEditId(null);

            navigate(`/teacher/${teacherId}/assessments/${data.id}/create`, {
              replace: true,
            });
          } else {
            const currentPath = location.pathname;
            const isOnValidStep =
              currentPath.includes("/create") ||
              currentPath.includes("/configure") ||
              currentPath.includes("/publish");

            if (!isOnValidStep) {
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
        // small delay to prevent race conditions
        setTimeout(() => {
          navigationInProgress.current = false;
        }, 50);
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
    if (assessmentId === "new" && draftId) {
      localStorage.setItem("currentAssessmentDraftId", draftId);
    }
  }, [assessmentId, draftId]);

  const isEditMode = Boolean(editId);

  if (isFetching || !assessmentDraft) {
    return <p>Loading {isEditMode ? "assessment" : "draft"}...</p>;
  }

  return (
    <PreviewProvider>
      <AssessmentBuilderProvider initialAssessment={assessmentDraft}>
        <AssessmentBuilder />
      </AssessmentBuilderProvider>
    </PreviewProvider>
  );
}
