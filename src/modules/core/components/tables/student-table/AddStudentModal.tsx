import { useState, type ReactElement } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import {
  AddStudentDTO,
  AddStudentSchema,
} from "../../../../student/types/student.schema";
import { APIErrorResponse } from "../../../../core/types/api/api.type";
import { handleApiError } from "../../../../core/utils/api/error.util";
import { useQueryClient } from "@tanstack/react-query";
import { useAdminContext } from "../../../../admin/context/admin.context";
import { useAdminAddStudent } from "../../../../admin/services/admin-student.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AddStudentModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddStudentModal({
  isOpen,
  onClose,
}: AddStudentModalProps): ReactElement {
  const { adminId, rawSections } = useAdminContext();
  const { mutate: addStudent, isPending: isSubmitting } =
    useAdminAddStudent(adminId);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors },
  } = useForm<AddStudentDTO>({
    resolver: zodResolver(AddStudentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      gender: undefined,
      email: "",
      referenceNumber: "",
      password: "",
      sectionId: undefined,
    },
  });

  const handleClose = () => {
    reset();
    setReferenceNumber("");
    onClose();
  };

  const onSubmit = async (data: AddStudentDTO) => {
    addStudent(data, {
      onSuccess: () => {
        toast.success("Student added successfully");
        queryClient.invalidateQueries({
          queryKey: ["admin", adminId, "students"],
        });
        handleClose();
      },
      onError: (err: unknown) => {
        if (isAxiosError(err)) {
          const errorData: APIErrorResponse = handleApiError(err);

          switch (errorData.error) {
            case "EMAIL_AND_LRN_ALREADY_EXISTS":
              setError("email", {
                type: "manual",
                message: "Email already exists",
              });
              setError("referenceNumber", {
                type: "manual",
                message: "Reference number already exists",
              });
              break;

            case "EMAIL_ALREADY_EXISTS":
              setError("email", {
                type: "manual",
                message: errorData.message || "Email already exists",
              });
              break;

            case "REFERENCE_NUMBER_ALREADY_EXISTS":
              setError("referenceNumber", {
                type: "manual",
                message: errorData.message || "Reference number already exists",
              });
              break;

            default:
              toast.error("Failed to add student");
          }
        }
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[100vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Add Student
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* first name */}
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name
                {errors.firstName && (
                  <span className="text-destructive text-xs ml-2">
                    {errors.firstName.message}
                  </span>
                )}
              </Label>
              <Input
                id="firstName"
                {...register("firstName")}
                placeholder="Enter first name"
              />
            </div>

            {/* last name */}
            <div className="space-y-2">
              <Label htmlFor="lastName">
                Last Name
                {errors.lastName && (
                  <span className="text-destructive text-xs ml-2">
                    {errors.lastName.message}
                  </span>
                )}
              </Label>
              <Input
                id="lastName"
                {...register("lastName")}
                placeholder="Enter last name"
              />
            </div>

            {/* middle name */}
            <div className="space-y-2">
              <Label htmlFor="middleName">
                Middle Name
                <span className="text-muted-foreground text-xs ml-1">
                  (Optional)
                </span>
                {errors.middleName && (
                  <span className="text-destructive text-xs ml-2">
                    {errors.middleName.message}
                  </span>
                )}
              </Label>
              <Input
                id="middleName"
                {...register("middleName")}
                placeholder="Enter middle name"
              />
            </div>

            {/* gender */}
            <div className="space-y-2">
              <Label htmlFor="gender">
                Gender
                {errors.gender && (
                  <span className="text-destructive text-xs ml-2">
                    {errors.gender.message}
                  </span>
                )}
              </Label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* email */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">
                Email
                {errors.email && (
                  <span className="text-destructive text-xs ml-2">
                    {errors.email.message}
                  </span>
                )}
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="Enter email"
              />
            </div>

            {/* LRN */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="referenceNumber">
                LRN (Learner Reference Number)
                {errors.referenceNumber && (
                  <span className="text-destructive text-xs ml-2">
                    {errors.referenceNumber.message}
                  </span>
                )}
              </Label>
              <Input
                id="referenceNumber"
                {...register("referenceNumber")}
                placeholder="Enter reference number"
                value={referenceNumber}
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, "");
                  if (val.length > 12) val = val.slice(0, 12);
                  setReferenceNumber(val);
                }}
              />
            </div>

            {/* password */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="password">
                Password
                {errors.password && (
                  <span className="text-destructive text-xs ml-2">
                    {errors.password.message}
                  </span>
                )}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  maxLength={32}
                  placeholder="Enter password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaRegEyeSlash className="h-4 w-4" />
                  ) : (
                    <FaRegEye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* section */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="section">
                Section
                {errors.sectionId && (
                  <span className="text-destructive text-xs ml-2">
                    {errors.sectionId.message}
                  </span>
                )}
              </Label>
              <Controller
                name="sectionId"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a section..." />
                    </SelectTrigger>
                    <SelectContent>
                      {rawSections.map((section) => (
                        <SelectItem key={section.id} value={section.id}>
                          {section.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Add Student"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
