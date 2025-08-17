import { useEffect, useState, type ReactElement } from "react";
import { useParams } from "react-router-dom";
import * as sectionType from "../../../../core/types/section/section.type";
import { CreateSectionDTO } from "../../../../core/types/section/section.schema";
import { IoClose } from "react-icons/io5";
import { getSectionBanner } from "../../../../core/utils/section/section.util";
import { useCreateSection } from "../../../../core/services/section/section.service";

export default function CreateSectionForm({
  setShowForm,
}: {
  setShowForm: (show: boolean) => void;
}): ReactElement {
  const { teacherId } = useParams();
  const [sectionData, setSectionData] = useState<CreateSectionDTO>({
    name: "",
    teacherId: teacherId as string,
    color: "primary-green",
    banner: "SBanner_1",
    lastChecked: new Date().toString(),
    studentIds: [] as string[],
    assessmentIds: [] as string[],
  });
  const [showError, setShowError] = useState(false);
  const { mutate: createSection } = useCreateSection(teacherId ?? "");

  useEffect(() => {
    if (teacherId) {
      setSectionData((prev) => ({
        ...prev,
        teacher: teacherId,
      }));
    }
  }, [teacherId]);

  const handleNameInputChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    if (value.length >= 40) return;
    setSectionData((prev) => ({
      ...prev,
      name: value,
    }));
    if (showError) setShowError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sectionData.name?.trim()) {
      setSectionData((prev) => ({
        ...prev,
        name: "",
      }));
      setShowError(true);
      return;
    }

    createSection(sectionData);
  };

  const handleClose = () => {
    setShowForm(false);
  };

  if (!teacherId) return <div>Loading...</div>;

  return (
    <div className="fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-black/20">
      <div className="rounded-md h-[100vh] w-[100vw] md:w-2xl md:h-fit bg-[var(--primary-white)] p-4">
        <form
          className="flex flex-col justify-between gap-4 h-full"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-4">
            <header className="flex items-center justify-between border-b-[var(--primary-gray)]/50 border-b-2 pb-4">
              <h2 className="">Add Section</h2>
              <button
                className="hover:scale-105 hover:cursor-pointer"
                onClick={handleClose}
              >
                <IoClose />
              </button>
            </header>
            <div className="flex w-full flex-col gap-4">
              {/* name input */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="name"
                  className={` font-semibold ${showError && "text-red-400"}`}
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={sectionData.name}
                  onChange={handleNameInputChange}
                  className={`border-1 rounded-lg bg-inherit p-2 focus:border-[var(--primary-green)] focus:outline-none`}
                  placeholder="Enter name here"
                />
              </div>

              {/* banner selection */}
              <div className="flex flex-col gap-2">
                <label htmlFor="color" className=" font-semibold">
                  Select Banner
                </label>
                <div className="overflow-x-auto no-scrollbar">
                  <div className="flex gap-4">
                    {["SBanner_1", "SBanner_2", "SBanner_3"].map((banner) => (
                      <label
                        key={banner}
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <input
                          type="radio"
                          name="color"
                          value={banner}
                          checked={sectionData.banner === banner}
                          onChange={() =>
                            setSectionData((prev) => ({
                              ...prev,
                              banner: banner as sectionType.SectionBanner,
                            }))
                          }
                          className="hidden"
                        />
                        <div
                          className={`border-1 h-20 w-32 rounded-lg hover:scale-105 ${sectionData.banner === banner ? "border-4 border-[var(--primary-green)]" : ""}`}
                        >
                          <img
                            src={getSectionBanner(sectionData.banner)}
                            alt="section banner"
                            className="h-full w-full rounded-sm object-cover"
                          />
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* color selection */}
              <div className="flex flex-col gap-2">
                <label htmlFor="color" className=" font-semibold">
                  Select Color
                </label>
                <div className="flex gap-4">
                  {[
                    "primary-green",
                    "tertiary-green",
                    "primary-orange",
                    "primary-yellow",
                  ].map((color) => (
                    <label
                      key={color}
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <input
                        type="radio"
                        name="color"
                        value={color}
                        checked={sectionData.color === color}
                        onChange={() =>
                          setSectionData((prev) => ({
                            ...prev,
                            color: color as sectionType.SectionColor,
                          }))
                        }
                        className="hidden"
                      />
                      <span
                        className={`bg-[var(--${color})] border-1 h-10 w-10 rounded-sm hover:scale-105 ${sectionData.color === color ? "border-3" : ""}`}
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* buttons */}
          <div className="flex w-full justify-between">
            <button
              className="opacity-80 hover:opacity-100 hover:cursor-pointer transition-colors duration-200"
              onClick={handleClose}
            >
              <p className="underline">Cancel</p>
            </button>
            <button
              type="submit"
              className="rounded-sm bg-[var(--primary-green)] px-5 py-2  text-white opacity-80 hover:opacity-100 hover:cursor-pointer transition-opacity duration-200"
            >
              Complete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
