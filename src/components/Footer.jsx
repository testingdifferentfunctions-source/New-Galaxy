import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/lib/useLanguage";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-[#333333]">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col items-center gap-3">
        <Link
          to="/privacy-policy"
          className="text-sm text-[#A0A0A0] hover:text-white transition-colors underline-offset-4 hover:underline"
        >
          {t("Політика конфіденційності", "Privacy Policy")}
        </Link>
        <p className="text-xs text-[#666666]">
          © {new Date().getFullYear()} New Galaxy
        </p>
      </div>
    </footer>
  );
}