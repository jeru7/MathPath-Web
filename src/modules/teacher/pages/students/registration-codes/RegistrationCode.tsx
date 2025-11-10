import { useState, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import RegistrationCodeItem from "./RegistrationCodeItem";
import GeneratedCode from "../components/add-student/GeneratedCode";
import { RegistrationCode as RegistrationCodeModel } from "../../../../core/types/registration-code/registration-code.type";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useTeacherContext } from "../../../context/teacher.context";
import {
  useTeacherDeleteRegistrationCode,
  useTeacherRegistrationCodes,
} from "../../../services/teacher-registration-code.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

export default function RegistrationCode(): ReactElement {
  const navigate = useNavigate();
  const { teacherId } = useTeacherContext();
  const { data: registrationCodes, refetch } =
    useTeacherRegistrationCodes(teacherId);
  const [selectedCode, setSelectedCode] =
    useState<RegistrationCodeModel | null>(null);

  const { mutate: deleteCode } = useTeacherDeleteRegistrationCode(teacherId);
  const queryClient = useQueryClient();

  const handleDelete = (codeId: string) => {
    deleteCode(codeId, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["teacher", teacherId, "registration-codes"],
        });

        toast.success("Code deleted successfully.");
        setSelectedCode(null);
        refetch();
      },
      onError: () => {
        toast.error("Failed to delete code.");
        setSelectedCode(null);
      },
    });
  };

  return (
    <>
      <Dialog open={true} onOpenChange={() => navigate("..")}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Registration Codes</DialogTitle>
          </DialogHeader>

          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px] p-4">
                {registrationCodes && registrationCodes.length > 0 ? (
                  <div className="space-y-3">
                    {registrationCodes.map((code) => (
                      <RegistrationCodeItem
                        key={code.id}
                        code={code}
                        onClick={() => setSelectedCode(code)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full min-h-[300px] items-center justify-center">
                    <p className="text-muted-foreground italic">
                      No registration codes available
                    </p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      {selectedCode && (
        <Dialog
          open={!!selectedCode}
          onOpenChange={() => setSelectedCode(null)}
        >
          <DialogContent className="max-w-md">
            <GeneratedCode
              code={selectedCode}
              handleBack={() => setSelectedCode(null)}
              handleDelete={handleDelete}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
