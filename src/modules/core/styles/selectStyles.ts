import { StylesConfig } from "react-select";

export type SelectStyleOptions = {
  borderRadius?: string;
  border?: boolean;
  borderColor?: string;
  borderFocusColor?: string;
  borderWidth?: string;
  minHeight?: string;
  height?: string;
  padding?: string;
  fontSize?: string;
  backgroundColor?: string;
  textColor?: string;
  optionHoverColor?: string;
  optionSelectedColor?: string;
  menuBackgroundColor?: string;
};

export const getCustomSelectColor = <T>(
  options?: SelectStyleOptions,
): StylesConfig<T> => ({
  control: (base) => ({
    ...base,
    backgroundColor: options?.backgroundColor || "inherit",
    border:
      options?.border === false
        ? "none"
        : `${options?.borderWidth || "1px"} solid ${options?.borderColor || "var(--primary-gray)"}`,
    boxShadow: "none",
    borderRadius: options?.borderRadius || "0.500rem",
    height: options?.height || "40px",
    minHeight: options?.minHeight || options?.height || "40px",
    padding: options?.padding || "0px 4px",
    fontSize: options?.fontSize || "0.875rem",
    color: options?.textColor || "inherit",
    "&:hover": {
      border:
        options?.border === false
          ? "none"
          : `${options?.borderWidth || "1px"} solid ${options?.borderColor || "var(--primary-gray)"}`,
    },
    "&:focus-within": {
      border:
        options?.border === false
          ? "none"
          : `${options?.borderWidth || "1px"} solid ${options?.borderFocusColor || "var(--tertiary-green)"}`,
      boxShadow:
        options?.border === false
          ? "none"
          : `0 0 0 1px ${options?.borderFocusColor || "var(--tertiary-green)"}`,
    },
  }),
  singleValue: (base) => ({
    ...base,
    color: options?.textColor || "inherit",
  }),
  input: (base) => ({
    ...base,
    color: options?.textColor || "inherit",
  }),
  placeholder: (base) => ({
    ...base,
    color: options?.textColor ? `${options.textColor}88` : "#9CA3AF", // slightly transparent
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? options?.optionSelectedColor || "var(--tertiary-green)"
      : state.isFocused
        ? options?.optionHoverColor || "#ceffc7"
        : options?.backgroundColor || "inherit",
    color: state.isSelected ? "white" : options?.textColor || "inherit",
    fontSize: options?.fontSize || "0.875rem",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: options?.menuBackgroundColor || options?.backgroundColor,
    borderRadius: "0.125rem",
    zIndex: 9999,
  }),
  valueContainer: (base) => ({
    ...base,
    padding: options?.padding || "0 4px",
    gap: "2px",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: "0 2px",
    cursor: "pointer",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
});
