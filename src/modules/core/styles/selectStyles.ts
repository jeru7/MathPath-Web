import { GroupBase, StylesConfig } from "react-select";

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
  menuMinWidth?: string;
  menuWidth?: string;
  hideIndicator?: boolean;
  indicatorPadding?: string;
};

export const getCustomSelectColor = <
  T,
  IsMulti extends boolean = false,
  G extends GroupBase<T> = GroupBase<T>,
>(
  options?: SelectStyleOptions,
): StylesConfig<T, IsMulti, G> => ({
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
  valueContainer: (base) => ({
    ...base,
    padding: options?.padding || "0 4px",
    gap: "6px",
  }),
  singleValue: (base) => ({
    ...base,
    color: options?.textColor || "inherit",
    marginRight: "6px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }),
  input: (base) => ({
    ...base,
    color: options?.textColor || "inherit",
  }),
  placeholder: (base) => ({
    ...base,
    color: options?.textColor ? `${options.textColor}88` : "#9CA3AF",
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
    backgroundColor: options?.menuBackgroundColor || "white",
    borderRadius: "0.125rem",
    zIndex: 9999,
    minWidth: options?.menuMinWidth,
    width: options?.menuWidth,
  }),
  dropdownIndicator: (base) =>
    options?.hideIndicator
      ? { ...base, display: "none", padding: 0, width: 0 }
      : {
          ...base,
          padding: options?.indicatorPadding ?? "0 4px",
          cursor: "pointer",
        },

  indicatorSeparator: () => ({
    display: "none",
  }),
});
