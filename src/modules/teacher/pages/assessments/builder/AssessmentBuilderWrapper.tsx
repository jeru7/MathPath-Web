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

  const [draftId, setDraftId] = useState<string | null>(null);
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
    if (!teacherId || hasInitialized.current) return;
    hasInitialized.current = true;

    const initializeAssessment = async () => {
      try {
        if (assessmentId && assessmentId !== "new") {
          // edit mode
          setEditId(assessmentId);
          setDraftId(null);

          // ensure we're on a valid edit step
          const currentPath = location.pathname;
          if (!currentPath.includes("/edit")) {
            navigate(
              `/teacher/${teacherId}/assessments/${assessmentId}/create/edit`,
              {
                replace: true,
              },
            );
          }
        } else {
          // create mode
          if (!draftId) {
            const data = await mutateAsync();
            localStorage.setItem("currentAssessmentDraftId", data.id);
            setDraftId(data.id);
            setEditId(null);

            // navigate to create step
            navigate(`/teacher/${teacherId}/assessments/${data.id}/create`, {
              replace: true,
            });
          } else {
            // ensure we're on create step for draft
            const currentPath = location.pathname;
            if (
              !currentPath.includes("/create") &&
              !currentPath.includes("/configure") &&
              !currentPath.includes("/publish")
            ) {
              setEditId(null);
              navigate(`/teacher/${teacherId}/assessments/${draftId}/create`, {
                replace: true,
              });
            }
          }
        }
      } catch (error) {
        console.error("Failed to initialize assessment:", error);
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
      if (assessmentId === "new" || draftId) {
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
      <AssessmentBuilderProvider initialAssessment={assessmentDraft}>
        <AssessmentBuilder />
      </AssessmentBuilderProvider>
    </PreviewProvider>
  );
}
