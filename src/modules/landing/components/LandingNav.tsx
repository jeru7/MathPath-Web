import { type ReactElement, useState, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function LandingNav(): ReactElement {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.75);

      const sections = ["hero", "features", "about", "members", "download"];
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return (
            rect.top <= window.innerHeight / 2 &&
            rect.bottom >= window.innerHeight / 2
          );
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection);
        if (location.hash !== `#${currentSection}`) {
          window.history.replaceState(null, "", `#${currentSection}`);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    const hash = location.hash.replace("#", "");
    if (
      hash &&
      ["hero", "features", "about", "members", "download"].includes(hash)
    ) {
      setActiveSection(hash);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]);

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

      window.history.pushState(null, "", `#${id}`);
      setActiveSection(id);
    }
  };

  const navItems = [
    { id: "hero", label: "Home" },
    { id: "features", label: "Features" },
    { id: "about", label: "About" },
    { id: "members", label: "Members" },
    { id: "download", label: "Download" },
  ];

  const isActive = (id: string) => activeSection === id;

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
                className={`md:hidden bg-transparent hover:bg-transparent ${scrolled ? "text-green-400" : "text-white"
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
                <div className="flex items-center justify-between p-6 border-b border-[hsl(240_10%_18%)]">
                  <p className="text-xl text-green-400 font-jersey font-bold">
                    Math-Path
                  </p>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="text-[hsl(0_0%_98%)] hover:text-green-400 transition-colors text-lg"
                  >
                    ✕
                  </button>
                </div>

                {/* navigation items */}
                <div className="flex-1 flex flex-col gap-1 p-4">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${isActive(item.id)
                          ? "bg-green-500 text-black shadow-md"
                          : "text-[hsl(0_0%_98%)] hover:bg-[hsl(240_10%_14%)] hover:text-green-400"
                        }`}
                    >
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  ))}

                  {/* login button in sidebar */}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/auth/login");
                    }}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-[hsl(0_0%_98%)] hover:bg-[hsl(240_10%_14%)] hover:text-green-400 border border-[hsl(240_10%_18%)] mt-4"
                  >
                    <span className="text-sm font-medium">Login</span>
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <button
            className={`hidden text-2xl font-bold hover:scale-105 transition-transform md:block ${scrolled ? "text-green-400" : "text-white"
              }`}
            onClick={() => scrollToSection("hero")}
          >
            Math-Path
          </button>

          {/* desktop navigation */}
          <div className="hidden items-center gap-6 font-bold md:flex lg:gap-12 lg:text-xl">
            {navItems
              .filter((item) => item.id !== "hero")
              .map((item) => (
                <button
                  key={item.id}
                  className={`hover:scale-105 transition-all relative ${scrolled
                      ? "text-[hsl(240_5%_65%)] hover:text-green-400"
                      : "text-[hsl(240_5%_65%)] hover:text-[hsl(0_0%_98%)]"
                    } ${isActive(item.id) ? "text-green-400" : ""}`}
                  onClick={() => scrollToSection(item.id)}
                >
                  {item.label}
                  {isActive(item.id) && (
                    <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-green-400 rounded-full"></span>
                  )}
                </button>
              ))}
          </div>

          {/* desktop login button */}
          <button
            className={`items-center rounded-full border-2 px-4 py-1 hover:scale-105 transition-all duration-200 md:flex md:px-5 ${scrolled
                ? "border-green-400 text-green-400 hover:bg-green-400/10"
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
