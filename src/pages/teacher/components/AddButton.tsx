import { type ReactElement } from "react"

export default function AddButton({ text, action }: { text: string, action: () => void }): ReactElement {
  return (
    <button className="hover:scale-101 rounded-md bg-[var(--primary-green)] px-8 py-4 shadow-sm hover:cursor-pointer"
      onClick={action}
    >
      <p className="text-lg text-[var(--primary-white)]">{text}</p>
    </button>
  )
}
