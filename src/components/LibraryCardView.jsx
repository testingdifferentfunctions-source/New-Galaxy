import React from "react";
import { Link } from "react-router-dom";
import { Link2, Check, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/lib/useLanguage";
import { useToast } from "@/components/ui/use-toast";

export default function LibraryCardView({ card }) {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  const title = language === "uk" ? card.title_uk : card.title_en;
  const description = language === "uk" ? card.description_uk : card.description_en;
  const detailPath = `/${language}/library/${card.slug}`;

  const handleCopy = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${detailPath}`);
      setCopied(true);
      toast({ description: t("Посилання скопійовано!", "Link copied!") });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="group flex flex-col rounded-xl border border-[#333333] bg-[#121212] p-6 transition-colors duration-200 hover:border-[#FFFFFF]">
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className="text-xl font-bold tracking-tight text-white leading-tight">
          {title}
        </h3>
        <ArrowUpRight className="w-5 h-5 text-[#555555] group-hover:text-white transition-colors shrink-0 mt-0.5" />
      </div>

      <p className="text-sm text-[#A0A0A0] leading-relaxed line-clamp-3 mb-6 flex-1">
        {description}
      </p>

      <div className="flex items-center gap-4 mt-auto pt-2">
        <Link
          to={detailPath}
          className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90"
        >
          {t("Переглянути", "View")}
        </Link>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-sm text-[#A0A0A0] hover:text-white transition-colors"
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Link2 className="w-4 h-4" />
          )}
          {t("Посилання", "Link")}
        </button>
      </div>
    </div>
  );
}