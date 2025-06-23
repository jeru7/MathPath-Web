import { type ReactElement } from "react"

export default function AddButton({ text, action }: { text: string, action: () => void }): ReactElement {
  return (
    <button className="rounded-md bg-[var(--primary-green)] px-8 py-4 opacity-90 shadow-sm hover:cursor-pointer hover:opacity-100"
      onClick={action}
    >
      <p className="text-lg text-[var(--primary-white)]">{text}</p>
    </button>
  )
}
