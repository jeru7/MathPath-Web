import { type ReactElement } from "react"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function MemberCard({photo, name} : {photo: string, name: string}): ReactElement {
  return <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-black bg-[var(--color-green-primary)] p-4 text-white xl:gap-8 xl:py-8">
    <div className="font-baloo flex flex-col items-center gap-4 md:flex-row">
      <div className="h-16 w-16 rounded-full border-2 border-[var(--color-yellow)] bg-white md:h-24 md:w-24 md:flex-none">
        <img className="h-full w-full rounded-full object-cover" src={photo}/>
      </div>
      <p className="text-center text-2xl font-bold md:text-left md:text-3xl">{name}</p>
    </div>
    <p className="text-center sm:text-xl md:text-left">Lorem ipsum dolor sit amet consecte adipiscing elit amet hendrerit pretium nulla sed enim iaculis mi.</p>
      <div className="flex gap-4">
        <Facebook className="cursor-pointer hover:scale-110 hover:text-[var(--color-yellow)]"/>
        <Instagram className="cursor-pointer hover:scale-110 hover:text-[var(--color-yellow)]"/>
        <Twitter className="cursor-pointer hover:scale-110 hover:text-[var(--color-yellow)]"/>
        <Linkedin className="cursor-pointer hover:scale-110 hover:text-[var(--color-yellow)]"/>
      </div>
  </div>
}
