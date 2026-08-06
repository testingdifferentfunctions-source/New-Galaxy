import React from "react";
import { useLanguage } from "@/lib/useLanguage";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const base =
    "px-3 py-1.5 text-sm font-semibold rounded-md transition-colors duration-200";

  return (
    <div className="inline-flex items-center gap-1 rounded-md border border-[#333333] bg-[#121212] p-1">
      <button
        onClick={() => setLanguage("uk")}
        className={
          language === "uk"
            ? `${base} bg-white text-black`
            : `${base} text-[#A0A0A0] hover:text-white`
        }
      >
        УК
      </button>
      <button
        onClick={() => setLanguage("en")}
        className={
          language === "en"
            ? `${base} bg-white text-black`
            : `${base} text-[#A0A0A0] hover:text-white`
        }
      >
        EN
      </button>
    </div>
  );
}