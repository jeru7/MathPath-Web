import { type ReactElement } from "react";
import kathImage from "../../../assets/teamMembers/kath.png";
import samImage from "../../../assets/teamMembers/sam.png";
import emmanImage from "../../../assets/teamMembers/emman.png";
import laImage from "../../../assets/teamMembers/la.png";
import MemberCard from "./components/MemberCard.js";
import { motion } from "framer-motion";

export default function Members(): ReactElement {
  const members = [
    {
      img: kathImage,
      name: "Dayoha, Kathleen Kate",
      role: {
        first: "Documents",
        second: "UI Designer",
      },
    },
    {
      img: samImage,
      name: "Marquez, Oliver Sam",
      role: {
        first: "Asst. Programmer",
      },
    },
    {
      img: emmanImage,
      name: "Ungab, John Emmanuel R.",
      role: {
        first: "Lead Programmer",
      },
    },
    {
      img: laImage,
      name: "Ventura, Lorriel Ann",
      role: {
        first: "UI Designer",
        second: "Documents",
      },
    },
  ];

  return (
    <section className="font-jersey flex w-screen flex-col items-center justify-center gap-16 bg-[var(--primary-black)] px-8 text-[var(--primary-white)]" id="members">
      <div className="flex flex-col gap-8">

        {/* title */}
        <div className="flex flex-col items-center">
          <motion.h2
            className="text-lg font-bold md:text-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ transition: 1, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
          >
            Meet Our
          </motion.h2>
          <motion.h3
            className="text-4xl font-bold md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ transition: 1, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
          >
            Team Members
          </motion.h3>
        </div>

        {/* members content */}
        <div className="grid grid-cols-2 grid-rows-2 gap-x-8 gap-y-4 md:flex">
          {members.map((member, index) => (
            <MemberCard
              key={index}
              className=""
              img={member.img}
              name={member.name}
              role={member.role}
            />
          ))}
        </div>
      </div>

      {/* divider */}
      <motion.div
        className="h-[1px] w-full bg-[var(--primary-green)]"
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 0.8, scaleX: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
      />
    </section>
  );
}
