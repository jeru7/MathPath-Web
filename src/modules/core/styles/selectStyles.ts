import { StylesConfig } from "react-select";

export interface SelectStyleOptions {
  borderRadius?: string;
  minHeight?: string;
  border?: boolean;
}

export const getCustomSelectColor = <T>(
  options?: SelectStyleOptions,
): StylesConfig<T> => ({
  control: (base) => ({
    ...base,
    backgroundColor: "inherit",
    border:
      options?.border === false ? "none" : `1px solid var(--primary-gray)`,
    boxShadow: "none",
    borderRadius: options?.borderRadius || "0.500rem",
    minHeight: options?.minHeight || "42px",
    "&:hover": {
      border:
        options?.border === false ? "none" : `1px solid var(--primary-gray)`,
    },
    "&:focus-within": {
      border:
        options?.border === false ? "none" : `1px solid var(--tertiary-green)`,
      boxShadow:
        options?.border === false ? "none" : `0 0 0 1px var(--tertiary-green)`,
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 4px",
    gap: "2px",
    display: "flex",
    justifyContent: "flex-end",
    flex: 1,
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: "0 2px",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "var(--tertiary-green)"
      : state.isFocused
        ? "#ceffc7"
        : "inherit",
    color: state.isSelected ? "white" : "inherit",
    fontSize: "0.875rem",
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
