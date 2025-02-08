import { type ReactElement } from "react"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function MemberCard(): ReactElement {
  return <div className="flex flex-col items-center gap-4 rounded-3xl border-2 border-black bg-[var(--color-green-primary)] p-4 text-white xl:gap-8 xl:py-8">
    <div className="font-baloo flex flex-col items-center gap-4 md:flex-row">
      <div className="h-16 w-16 rounded-full border-2 border-[var(--color-yellow)] bg-white md:flex-none"></div>
      <p className="text-2xl font-bold md:text-3xl">Ungab, John Emmanuel</p>
    </div>
    <p className="text-center sm:text-xl">Lorem ipsum dolor sit amet consecte adipiscing elit amet hendrerit pretium nulla sed enim iaculis mi.</p>
      <div className="flex gap-4">
        <Facebook/>
        <Instagram/>
        <Twitter/>
        <Linkedin/>
      </div>
  </div>
}