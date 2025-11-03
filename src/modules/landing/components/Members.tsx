import { type ReactElement } from "react";
import { motion } from "framer-motion";
import kathImage from "../../../assets/images/team-members/kath.png";
import samImage from "../../../assets/images/team-members/sam.png";
import emmanImage from "../../../assets/images/team-members/emman.png";
import laImage from "../../../assets/images/team-members/la.png";
import MemberCard from "./MemberCard";

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
    <section
      id="members"
      className="font-jersey flex flex-col items-center justify-center gap-12 bg-inherit px-4 py-12 text-[var(--primary-white)] sm:px-6 md:px-8"
    >
      <div className="flex flex-col w-full max-w-screen-xl items-center gap-8">
        <div className="flex flex-col items-center text-center">
          <motion.h2
            className="text-base font-bold sm:text-lg md:text-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
          >
            Meet Our
          </motion.h2>

          <motion.h3
            className="text-3xl font-bold sm:text-4xl md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            viewport={{ once: true }}
          >
            Team Members
          </motion.h3>
        </div>

        <div
          className="
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            lg:grid-cols-4 
            gap-8 
            w-full 
            place-items-center
          "
        >
          {members.map((member, index) => (
            <MemberCard
              key={index}
              img={member.img}
              name={member.name}
              role={member.role}
            />
          ))}
        </div>
      </div>

      <motion.div
        className="h-[1px] w-full max-w-screen-xl bg-[var(--primary-green)]"
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 0.8, scaleX: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
      />
    </section>
  );
}
