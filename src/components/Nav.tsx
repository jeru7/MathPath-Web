import { useState, type ReactElement } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Nav(): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      <nav className="font-baloo fixed top-0 z-10 w-full bg-[var(--color-green-primary)] p-5 text-white shadow md:flex md:items-center md:justify-between">
        <div className="flex items-center justify-between">
          <span
            className="cursor-pointer text-4xl font-bold"
            onClick={(e) => {
              e.preventDefault();
              navigate("/")
              document
                .getElementById("main-hero")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            MathPath
          </span>
          <span className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={36} /> : <Menu size={36} />}
          </span>
        </div>
        <ul
          className={`absolute left-0 w-full bg-[var(--color-green-primary)] py-4 pl-3 md:static md:z-auto md:flex md:w-fit md:items-center md:py-0 md:pl-0 md:opacity-100 ${isOpen ? "opacity-100" : "hidden opacity-0"}`}
        >
          <li className="mx-4 my-6 md:my-0">
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="hover:text-yellow text-xl duration-300 hover:cursor-pointer md:font-semibold"
            >
              ABOUT
            </a>
          </li>
          <li className="mx-4 my-6 md:my-0">
            <a
              href="#"
              className="hover:text-yellow text-xl duration-300 md:font-semibold"
            >
              DOWNLOAD
            </a>
          </li>
          <button className="duration:500 rounded-3xl border bg-[var(--color-yellow)] px-6 py-2 text-xl font-bold text-black hover:scale-105 hover:cursor-pointer">
            LOG IN
          </button>
        </ul>
      </nav>
    </>
  );
}
