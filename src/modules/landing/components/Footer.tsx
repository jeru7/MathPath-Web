import { type ReactElement } from "react";

export default function Footer(): ReactElement {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="font-jersey flex flex-col items-center justify-center bg-[var(--primary-green)] text-[var(--primary-black)] py-8 px-6">
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl gap-6 md:gap-8">
        <div className="text-center md:text-left">
          <h3 className="text-2xl md:text-3xl font-bold tracking-wide">
            MathPath
          </h3>
          <p className="text-sm md:text-base mt-2 opacity-80">
            Mastering Mathematics Through Adventure
          </p>
        </div>

        <div className="flex flex-col items-center md:items-start gap-2">
          <a
            href="#about"
            className="text-sm hover:underline opacity-80 hover:opacity-100 transition-opacity"
          >
            About
          </a>
          <a
            href="#features"
            className="text-sm hover:underline opacity-80 hover:opacity-100 transition-opacity"
          >
            Features
          </a>
          <a
            href="#contact"
            className="text-sm hover:underline opacity-80 hover:opacity-100 transition-opacity"
          >
            Contact
          </a>
        </div>

        {/* Social Links */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <h4 className="text-lg font-semibold mb-2">Follow Us</h4>
          <div className="flex gap-4">
            <a
              href="#"
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              <span className="text-sm">Twitter</span>
            </a>
            <a
              href="#"
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              <span className="text-sm">Facebook</span>
            </a>
            <a
              href="#"
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              <span className="text-sm">Instagram</span>
            </a>
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl mt-8 pt-4 border-t border-[var(--primary-black)] border-opacity-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div className="text-center md:text-left">
            <p>&copy; {currentYear} MathPath. All rights reserved.</p>
          </div>
          <div className="flex gap-6 text-sm opacity-80">
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
            <a href="#" className="hover:underline">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
