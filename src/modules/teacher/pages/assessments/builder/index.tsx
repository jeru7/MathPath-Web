import { useEffect, useRef, useState, type ReactElement } from "react";
import AssessmentBuilderProvider from "./context/AssessmentBuilderProvider";
import AssessmentBuilder from "./AssessmentBuilder";
import { useParams } from "react-router-dom";
import { useCreateAssessmentDraft } from "../../../../core/services/assessments/assessment.service";
import { useTeacherAssessment } from "../../../services/teacher.service";

export default function AssessmentBuilderWrapper(): ReactElement {
  const { teacherId } = useParams();
  const hasInitialized = useRef(false);

  const [draftId, setDraftId] = useState<string | null>(
    localStorage.getItem("currentAssessmentDraftId"),
  );

  const { data: assessmentDraft, isFetching } = useTeacherAssessment(
    teacherId ?? "",
    draftId ?? "",
  );

  const { mutateAsync } = useCreateAssessmentDraft(teacherId ?? "");

  useEffect(() => {
    if (!teacherId || hasInitialized.current || draftId) return;

    hasInitialized.current = true;

    mutateAsync()
      .then((data) => {
        localStorage.setItem("currentAssessmentDraftId", data.id);
        setDraftId(data.id);
      })
      .catch((error) => {
        console.log("Failed to create assessment draft: ", error);
      });
  }, [teacherId, mutateAsync, draftId]);

  if (isFetching || !assessmentDraft) {
    return <p>Loading assessment draft...</p>;
  }

  return (
    <AssessmentBuilderProvider initialAssessment={assessmentDraft}>
      <AssessmentBuilder />
    </AssessmentBuilderProvider>
  );
}
