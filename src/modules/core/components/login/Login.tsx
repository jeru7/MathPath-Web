import { type ReactElement } from "react";
import mathPathTitle from "../../../../assets/svgs/mathpath-title.svg";
import bgTrees from "../../../../assets/images/background-image/trees.png";
import upperTrees from "../../../../assets/svgs/top-trees.svg";
import bottomBush from "../../../../assets/svgs/bottom-bush.svg";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";

export default function Login(): ReactElement {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen flex flex-col relative">
      <header className="z-20 flex w-full items-center justify-center p-4 md:justify-start md:p-8">
        <img
          src={mathPathTitle}
          alt="MathPath Icon/Logo"
          className="aspect-[16/9] w-[60%] min-w-[150px] max-w-[300px] hover:scale-105 hover:cursor-pointer md:w-[10vw] transition-transform duration-100"
          onClick={() => navigate("/")}
        />
      </header>

      <div className="absolute flex h-full w-full justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.8)), url(${bgTrees})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        <motion.div
          className="absolute left-0 right-0 top-0 min-h-[120px] w-full bg-cover bg-top md:bg-contain xl:h-[20vh] xl:bg-center"
          style={{
            backgroundImage: `url(${upperTrees})`,
            willChange: "transform",
          }}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="md:bg-fill absolute bottom-0 left-1/2 h-[30vh] w-full -translate-x-1/2 bg-cover lg:bg-center"
          style={{
            backgroundImage: `url(${bottomBush})`,
            willChange: "transform",
          }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
        >
          <div className="absolute bottom-0 left-0 h-20 w-full bg-gradient-to-t from-[#222222] to-transparent" />
        </motion.div>
      </div>

      <div className="w-full h-full border-2 flex items-start justify-center md:pt-8">
        <LoginForm />
      </div>
    </div>
  );
}
