import { useEffect, useRef, useState, type ReactElement } from "react";
import AssessmentBuilderProvider from "./context/AssessmentBuilderProvider";
import AssessmentBuilder from "./AssessmentBuilder";
import { useNavigate, useParams } from "react-router-dom";
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
  const hasInitialized = useRef(false);

  // determine initial draftid: from params or localstorage
  const [draftId, setDraftId] = useState<string | null>(
    assessmentId && assessmentId !== "new"
      ? assessmentId
      : localStorage.getItem("currentAssessmentDraftId"),
  );

  const { data: assessmentDraft, isFetching } = useTeacherAssessment(
    teacherId ?? "",
    draftId ?? "",
  );

  const { mutateAsync: createDraft } = useCreateAssessmentDraft(
    teacherId ?? "",
  );

  useEffect(() => {
    if (!teacherId || hasInitialized.current) return;
    hasInitialized.current = true;

    const initialize = async () => {
      try {
        if (!draftId) {
          const data = await createDraft();
          localStorage.setItem("currentAssessmentDraftId", data.id);
          setDraftId(data.id);

          if (!window.location.pathname.includes(data.id)) {
            navigate(`/teacher/${teacherId}/assessments/${data.id}/create`, {
              replace: true,
            });
          }
        } else {
          if (!window.location.pathname.includes(draftId)) {
            navigate(`/teacher/${teacherId}/assessments/${draftId}/create`, {
              replace: true,
            });
          }
        }
      } catch (err) {
        console.error("Failed to create assessment draft:", err);
      }
    };

    initialize();
  }, [teacherId, draftId, createDraft, navigate]);

  // loading state
  if (isFetching || !assessmentDraft) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p>Loading assessment draft...</p>
        </div>
      </div>
    );
  }

  return (
    <PreviewProvider>
      <AssessmentBuilderProvider initialAssessment={assessmentDraft}>
        <AssessmentBuilder />
      </AssessmentBuilderProvider>
    </PreviewProvider>
  );
}
