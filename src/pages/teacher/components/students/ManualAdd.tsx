import { useEffect, type ReactElement } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react";
import Select from 'react-select'

import FormButtons from "../FormButtons";
import { getCustomSelectColor } from "../../../../utils/selectStyles";
import { StudentFormData, studentFormSchema } from "../../../../types/student";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStudentService } from "../../../../services/studentService";
import { useTeacherContext } from "../../../../hooks/useTeacherData";
import { SectionType } from "../../../../types/section";

interface IManualAddProps {
  handleBack: () => void
}

export default function ManualAdd({ handleBack }: IManualAddProps): ReactElement {
  const { teacherId } = useParams()
  const { sections } = useTeacherContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log(sections);
  })

  const {
    register,
    handleSubmit,
    control,
    formState: {
      errors,
      isSubmitting },
  }
    = useForm<StudentFormData>({
      resolver: zodResolver(studentFormSchema)
    })

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("..")
  }

  const createStudent = useMutation({
    mutationFn: createStudentService,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher", teacherId, 'students'],
      });

      queryClient.invalidateQueries({
        queryKey: ["teacher", teacherId, 'sections'],
      });
      navigate("..");
    },
    onError: (error) => {
      console.error("Error in adding section.", error)
    }
  });

  const onSubmit = async (data: StudentFormData) => {
    createStudent.mutate(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="relative flex w-[50vw] flex-col gap-4 rounded-lg bg-[var(--primary-white)] p-8 shadow-sm">
        <button className="absolute right-4 top-4 hover:scale-105 hover:cursor-pointer"
          onClick={handleClose}
        ><X className="h-4 w-4" /></button>
        <header>
          <h3 className="border-b border-b-[var(--primary-gray)] pb-2 text-2xl font-bold">Add Student - Manual</h3>
        </header>
        <div className="flex flex-col gap-2">
          {/* First name */}
          <div className="flex gap-2">
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center gap-2">
                <label htmlFor="firstName" className="font-bold">First Name</label>
                {errors.firstName && (
                  <p className="text-md text-red-500">{errors?.firstName?.message}</p>
                )}
              </div>
              <input type="text"
                {...register("firstName")}
                name="firstName"
                placeholder="Enter first name"
                className="border-1 rounded-lg p-2 focus:border-[var(--tertiary-green)] focus:outline-none focus:ring-1 focus:ring-[var(--tertiary-green)]"
              />
            </div>
            {/* Last name */}
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center gap-2">
                <label htmlFor="lastName" className="font-bold">
                  Last Name </label>
                {errors.lastName && (
                  <p className="text-md text-red-500">{errors?.lastName?.message}</p>
                )}
              </div>
              <input type="text"
                {...register("lastName")}
                name="lastName"
                placeholder="Enter last name"
                className="border-1 rounded-lg p-2 focus:border-[var(--tertiary-green)] focus:outline-none focus:ring-1 focus:ring-[var(--tertiary-green)]"
              />
            </div>
          </div>
          <div className="flex gap-4">
            {/* Middle name */}
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center gap-2">
                <label htmlFor="middleName" className="font-bold">
                  Middle Name <span className="text-md font-normal text-gray-500">(Optional)</span></label>
                {errors.middleName && (
                  <p className="text-md text-red-500">{errors?.middleName?.message}</p>
                )}
              </div>
              <input type="text"
                {...register("middleName")}
                name="middleName"
                placeholder="Enter middle name"
                className="border-1 rounded-lg p-2 focus:border-[var(--tertiary-green)] focus:outline-none focus:ring-1 focus:ring-[var(--tertiary-green)]"
              />
            </div>
            {/* Gender */}
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center gap-2">
                <label htmlFor="gender" className="text-md font-bold">Gender</label>
                {errors.gender && (
                  <p className="text-md text-red-500">{errors?.gender?.message}</p>
                )}
              </div>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select<{ value: "male" | "female"; label: string }>
                    {...field}
                    id="gender"
                    name="gender"
                    options={[
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" },
                    ]}
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.value}
                    styles={getCustomSelectColor()}
                    className="basic-select"
                    classNamePrefix="select"
                    placeholder="Select gender..."
                    onChange={(selected) => field.onChange(selected?.value)}
                    value={
                      field.value
                        ? { value: field.value, label: field.value === "male" ? "Male" : "Female" }
                        : null
                    }
                  />
                )}
              />
            </div>
          </div>
          {/* Email */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <label htmlFor="email" className="font-bold">Email</label>
              {errors.email && (
                <p className="text-md text-red-500">{errors?.email?.message}</p>
              )}
            </div>
            <input type="email"
              {...register("email")}
              name="email"
              placeholder="Enter email"
              className="border-1 rounded-lg p-2 focus:border-[var(--tertiary-green)] focus:outline-none focus:ring-1 focus:ring-[var(--tertiary-green)]"
            />
          </div>
          {/* Student Number */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <label htmlFor="studentNumber" className="font-bold">Student Number</label>
              {errors.studentNumber && (
                <p className="text-md text-red-500">{errors?.studentNumber?.message}</p>
              )}
            </div>
            <input type="text"
              {...register("studentNumber")}
              name="studentNumber"
              placeholder="Enter student number"
              className="border-1 rounded-lg p-2 [appearance:textfield] focus:border-[var(--tertiary-green)] focus:outline-none focus:ring-1 focus:ring-[var(--tertiary-green)]"
            />
          </div>
          {/* Username */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <label htmlFor="username" className="font-bold">Username</label>
              {errors.username && (
                <p className="text-md text-red-500">{errors?.username?.message}</p>
              )}
            </div>
            <input type="text"
              {...register("username")}
              name="username"
              placeholder="Enter username"
              className="border-1 rounded-lg p-2 focus:border-[var(--tertiary-green)] focus:outline-none focus:ring-1 focus:ring-[var(--tertiary-green)]"
            />
          </div>
          {/* Password */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <label htmlFor="password" className="font-bold">Password</label>
              {errors.password && (
                <p className="text-md text-red-500">{errors?.password?.message}</p>
              )}
            </div>
            <input type="password"
              {...register("password")}
              name="password"
              placeholder="Enter password"
              className="border-1 rounded-lg p-2 focus:border-[var(--tertiary-green)] focus:outline-none focus:ring-1 focus:ring-[var(--tertiary-green)]"
            />
          </div>
          {/* Section */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <label htmlFor="section" className="text-md font-bold">Section</label>
              {errors.section && (
                <p className="text-md text-red-500">{errors?.section?.message}</p>
              )}
            </div>
            <Controller
              name="section"
              control={control}
              render={({ field }) => (
                <Select<SectionType>
                  {...field}
                  id="section"
                  name="section"
                  options={sections}
                  getOptionLabel={(option: SectionType) => option.name}
                  getOptionValue={(option: SectionType) => option._id}
                  styles={getCustomSelectColor()}
                  className="basic-select"
                  classNamePrefix="select"
                  placeholder="Select a section..."
                  onChange={(selected) => field.onChange(selected?._id)}
                  value={sections.find(section => section._id === field.value) || null}
                />
              )}
            />
          </div>
        </div>
        <FormButtons handleBack={handleBack} text={isSubmitting ? "Creating..." : "Complete"} disabled={isSubmitting} />
      </div>
    </form>
  )
}
