import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Tag, List, Package } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/useLanguage";
import LanguageToggle from "@/components/LanguageToggle";
import ContentBlocks from "@/components/ContentBlocks";
import Footer from "@/components/Footer";

export default function LibraryDetail() {
  const { slug } = useParams();
  const { language, t } = useLanguage();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    base44.entities.LibraryCard
      .filter({ slug })
      .then((data) => {
        setCard(data[0] || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212]">
        <div className="w-8 h-8 border-4 border-[#333333] border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212] gap-4 text-[#E0E0E0]">
        <p className="text-[#A0A0A0]">
          {t("Бібліотеку не знайдено", "Library not found")}
        </p>
        <Link to="/" className="text-white underline">
          {t("Повернутися", "Go back")}
        </Link>
      </div>
    );
  }

  const title = language === "uk" ? card.title_uk : card.title_en;
  const description =
    language === "uk" ? card.description_uk : card.description_en;
  const content = language === "uk" ? card.content_uk : card.content_en;

  // Auto-generate TOC from heading/subheading blocks
  const toc = (content || [])
    .map((block, i) => ({ ...block, id: `block-${i}` }))
    .filter((b) => b.type === "heading" || b.type === "subheading")
    .map((b) => ({
      id: b.id,
      text: b.text,
      level: b.type === "heading" ? 1 : 2,
    }));

  return (
    <div className="min-h-screen bg-[#121212] text-[#E0E0E0]">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-[#333333] bg-[#121212]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium text-[#A0A0A0] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("Усі бібліотеки", "All libraries")}
          </Link>
          <LanguageToggle />
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-5 leading-tight">
          {title}
        </h1>
        <p className="text-lg text-[#A0A0A0] leading-relaxed max-w-2xl mb-6">
          {description}
        </p>

        {card.tags && card.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {card.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#333333] px-3 py-1 text-xs font-medium text-[#A0A0A0]"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Body: TOC sidebar + content */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12">
          {/* TOC */}
          {toc.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <div className="flex items-center gap-2 mb-4">
                  <List className="w-4 h-4 text-[#A0A0A0]" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">
                    {t("Зміст", "Contents")}
                  </h2>
                </div>
                <nav className="space-y-1 border-l border-[#333333]">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block border-l-2 -ml-[1px] pl-4 py-1.5 text-sm transition-colors hover:text-white hover:border-white ${
                        item.level === 2
                          ? "ml-4 text-[#777777]"
                          : "text-[#A0A0A0]"
                      }`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          {/* Content */}
          <article className="min-w-0 max-w-3xl">
            <ContentBlocks blocks={content} />
          </article>
        </div>
      </section>

      {/* Footer: official source link */}
      <footer className="border-t border-[#333333]">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={card.official_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
            >
              <ExternalLink className="w-4 h-4" />
              {t("Офіційна документація", "Official documentation")}
            </a>
            {card.pypi_url && (
              <a
                href={card.pypi_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-white px-6 py-3 text-sm font-semibold text-white bg-transparent transition-colors hover:bg-white hover:text-black"
              >
                <Package className="w-4 h-4" />
                {t("PyPI", "View on PyPI")}
              </a>
            )}
          </div>
          <p className="text-xs text-[#666666]">{card.official_url}</p>
          <Link
            to="/privacy-policy"
            className="text-xs text-[#A0A0A0] hover:text-white transition-colors underline-offset-4 hover:underline mt-2"
          >
            {t("Політика конфіденційності", "Privacy Policy")}
          </Link>
        </div>
      </footer>
    </div>
  );
}