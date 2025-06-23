import { StylesConfig } from "react-select";

export interface SelectStyleOptions {
  borderRadius?: string;
  minHeight?: string;
}

export const getCustomSelectColor = <T>(
  options?: SelectStyleOptions,
): StylesConfig<T> => ({
  control: (base) => ({
    ...base,
    backgroundColor: "inherit",
    borderColor: "var(--primary-gray)",
    borderRadius: options?.borderRadius || "0.500rem",
    minHeight: options?.minHeight || "42px",
    "&:hover": {
      borderColor: "var(--primary-gray)",
    },
    "&:focus-within": {
      borderColor: "var(--tertiary-green)",
      boxShadow: "0 0 0 1px var(--tertiary-green)",
    },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "var(--tertiary-green)"
      : state.isFocused
        ? "#ceffc7"
        : "inherit",
    color: state.isSelected ? "white" : "inherit",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "var(--primary-white)",
    borderRadius: "0.125rem",
    zIndex: 9999,
  }),
  singleValue: (base) => ({
    ...base,
    color: "inherit",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#9CA3AF",
  }),
  input: (base) => ({
    ...base,
    color: "inherit",
  }),
});
