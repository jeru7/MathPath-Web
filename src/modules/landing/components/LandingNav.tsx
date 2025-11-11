import { type ReactElement, useState, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function LandingNav(): ReactElement {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.75);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
  }, [isMenuOpen]);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      const offset =
        section.offsetTop - (window.innerHeight / 2 - section.clientHeight / 2);
      window.scrollTo({ top: offset, behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const navItems = [
    { id: "features", label: "Features" },
    { id: "about", label: "About" },
    { id: "members", label: "Members" },
    { id: "download", label: "Download" },
  ];

  return (
    <>
      <nav
        className={`font-jersey fixed left-0 right-0 top-0 z-50 h-16 transition-colors duration-300 px-4 border-b md:px-32 ${scrolled
            ? "shadow-lg bg-[hsl(240_10%_10%)] border-[hsl(240_10%_18%)]"
            : "bg-transparent border-transparent"
          }`}
      >
        <div className="flex w-full h-full items-center justify-between">
          {/* mobile menu button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                className={`md:hidden bg-transparent hover:bg-transparent ${scrolled ? "text-primary" : "text-white"
                  }`}
              >
                <GiHamburgerMenu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-80 p-0 bg-[hsl(240_10%_10%)] border-r border-[hsl(240_10%_18%)] [&>button]:hidden"
            >
              <div className="flex flex-col h-full">
                {/* header */}
                <p className="flex items-center text-xl text-primary font-jersey font-bold justify-between p-6 border-b border-none">
                  Math-Path
                </p>

                {/* navigation items */}
                <div className="flex-1 flex flex-col gap-1 p-4">
                  <button
                    onClick={() => scrollToSection("hero")}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-[hsl(0_0%_98%)] hover:bg-[hsl(240_10%_14%)]"
                  >
                    <span className="text-sm font-medium">Home</span>
                  </button>

                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-[hsl(0_0%_98%)] hover:bg-[hsl(240_10%_14%)]"
                    >
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <button
            className={`hidden text-2xl font-bold hover:scale-105 transition-transform md:block ${scrolled ? "text-primary" : "text-white"
              }`}
            onClick={() => scrollToSection("hero")}
          >
            Math-Path
          </button>

          {/* desktop navigation */}
          <div className="hidden items-center gap-6 font-bold md:flex lg:gap-12 lg:text-xl">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`hover:scale-105 transition-all ${scrolled
                    ? "text-[hsl(240_5%_65%)] hover:text-primary"
                    : "text-[hsl(240_5%_65%)] hover:text-[hsl(0_0%_98%)]"
                  }`}
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* desktop login button */}
          <button
            className={`items-center rounded-full border-2 px-4 py-1 hover:scale-105 transition-all duration-200 md:flex md:px-5 ${scrolled
                ? "border-primary text-primary hover:bg-primary/10"
                : "border-white text-white"
              }`}
            onClick={() => navigate("/auth/login")}
          >
            <p className="text-lg font-bold md:text-xl">Login</p>
          </button>
        </div>
      </nav>
    </>
  );
}
