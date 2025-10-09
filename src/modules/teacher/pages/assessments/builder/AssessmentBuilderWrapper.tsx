import { useEffect, useRef, useState, type ReactElement } from "react";
import AssessmentBuilderProvider from "./context/AssessmentBuilderProvider";
import AssessmentBuilder from "./AssessmentBuilder";
import { useNavigate, useParams } from "react-router-dom";
import { useTeacherAssessment } from "../../../services/teacher.service";
import { useCreateAssessmentDraft } from "../../../services/teacher-assessment.service";
import { PreviewProvider } from "../../../../core/contexts/preview/PreviewProvider";

export default function AssessmentBuilderWrapper(): ReactElement {
  const { teacherId, assessmentId } = useParams();
  const navigate = useNavigate();
  const hasInitialized = useRef(false);

  const [draftId, setDraftId] = useState<string | null>(
    assessmentId && assessmentId !== "new"
      ? assessmentId
      : localStorage.getItem("currentAssessmentDraftId"),
  );

  const { data: assessmentDraft, isFetching } = useTeacherAssessment(
    teacherId ?? "",
    draftId ?? "",
  );

  const { mutateAsync } = useCreateAssessmentDraft(teacherId ?? "");

  useEffect(() => {
    if (!teacherId || hasInitialized.current) return;

    hasInitialized.current = true;

    if (!draftId) {
      mutateAsync()
        .then((data) => {
          localStorage.setItem("currentAssessmentDraftId", data.id);
          setDraftId(data.id);
          navigate(`/teacher/${teacherId}/assessments/${data.id}/create`, {
            replace: true,
          });
        })
        .catch((error) => {
          console.log("Failed to create assessment draft: ", error);
        });
    } else {
      navigate(`/teacher/${teacherId}/assessments/${draftId}/create`, {
        replace: true,
      });
    }
  }, [teacherId, mutateAsync, draftId, navigate]);

  useEffect(() => {
    return () => {
      localStorage.removeItem("currentAssessmentDraftId");
    };
  }, []);

  if (isFetching || !assessmentDraft || !hasInitialized) {
    return <p>Loading assessment draft...</p>;
  }

  return (
    <PreviewProvider>
      <AssessmentBuilderProvider initialAssessment={assessmentDraft}>
        <AssessmentBuilder />
      </AssessmentBuilderProvider>
    </PreviewProvider>
  );
}
