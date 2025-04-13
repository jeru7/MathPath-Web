import { type ReactElement } from "react"

interface IFormButtonsProps {
  handleBack: () => void,
  text: string,
  disabled: boolean,
}

export default function FormButtons({ handleBack, text, disabled }: IFormButtonsProps): ReactElement {
  return <>
    <div className="flex w-full justify-end gap-4 text-lg">
      <button type="button"
        onClick={handleBack}
        className="border-1 rounded-lg px-4 py-1 opacity-80 transition-opacity duration-200 hover:cursor-pointer hover:opacity-100">
        Back</button>
      <button type="submit"
        disabled={disabled}
        className="border-1 bg-[var(--primary-green)]/90 rounded-lg px-8 py-2 text-white transition-colors duration-200 hover:cursor-pointer hover:bg-[var(--primary-green)]">
        {text}</button>
    </div>
  </>
}
