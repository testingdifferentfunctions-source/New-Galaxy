import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/useLanguage";
import LanguageToggle from "@/components/LanguageToggle";
import LibraryCardView from "@/components/LibraryCardView";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
import { mockLibraries } from "@/lib/mockData";

export default function LibraryDirectory() {
  const { language, t } = useLanguage();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [semanticResults, setSemanticResults] = useState(null);
  const [semanticLoading, setSemanticLoading] = useState(false);

  useEffect(() => {
  setCards(mockLibraries);
  setLoading(false);
}, []);

  // Debounced semantic search via the LLM integration.
  // Ranks libraries by semantic relevance to the query in the active language.
  useEffect(() => {
    const q = query.trim();
    if (q.length < 3) {
      setSemanticResults(null);
      return;
    }
    setSemanticLoading(true);
    const handle = setTimeout(async () => {
      try {
        const catalog = (Array.isArray(cards) ? cards : []).map((c) => ({
          id: c.id,
          slug: c.slug,
          title: language === "uk" ? c.title_uk : c.title_en,
          description: language === "uk" ? c.description_uk : c.description_en,
          tags: c.tags || [],
        }));
        const prompt = `You are a semantic search engine for a curated Python library catalog.
Return the ids of the libraries most relevant to the user's query, ranked by semantic meaning (intent, synonyms, related concepts). The query is in ${language === "uk" ? "Ukrainian" : "English"}.
Query: "${q}"
Catalog (JSON):
${JSON.stringify(catalog)}
Respond with a JSON object { "results": [id, ...] } listing the most relevant library ids in descending order of relevance. Only include relevant ones. Maximum 12.`;
        const res = await base44.integrations.Core.InvokeLLM({
          prompt,
          response_json_schema: {
            type: "object",
            properties: {
              results: { type: "array", items: { type: "string" } },
            },
            required: ["results"],
          },
        });
        const ids =
          res?.results || res?.data?.results || res?.output?.results || [];
        const byId = new Map((Array.isArray(cards) ? cards : []).map((c) => [c.id, c]));
        const bySlug = new Map((Array.isArray(cards) ? cards : []).map((c) => [c.slug, c]));
        
        const ranked = Array.isArray(ids) ? ids
          .map((id) => byId.get(id) || bySlug.get(id))
          .filter(Boolean) : [];
          
        setSemanticResults(ranked.length > 0 ? ranked : null);
      } catch {
        setSemanticResults(null);
      } finally {
        setSemanticLoading(false);
      }
    }, 500);
    return () => clearTimeout(handle);
  }, [query, language, cards]);

  const displayed = useMemo(() => {
    const q = query.trim();
    const safeCards = Array.isArray(cards) ? cards : [];
    const safeSemantic = Array.isArray(semanticResults) ? semanticResults : [];

    if (q.length === 0) return safeCards;
    if (semanticResults) return safeSemantic;
    
    const ql = q.toLowerCase();
    // ЗАХИСТ 3: Використовуємо .filter тільки для масиву
    return safeCards.filter(
      (c) =>
        c.title_uk?.toLowerCase().includes(ql) ||
        c.title_en?.toLowerCase().includes(ql) ||
        c.description_uk?.toLowerCase().includes(ql) ||
        c.description_en?.toLowerCase().includes(ql) ||
        (Array.isArray(c.tags) && c.tags.some((tag) => tag.toLowerCase().includes(ql)))
    );
  }, [cards, query, semanticResults]);

  return (
    <div className="min-h-screen bg-[#121212] text-[#E0E0E0]">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-[#333333] bg-[#121212]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <Logo size={36} />
            <h1 className="text-base font-bold tracking-tight leading-none text-white">
              {t("New Galaxy", "New Galaxy")}
            </h1>
          </Link>
          <LanguageToggle />
        </div>
      </header>

      {/* Hero + Search */}
      <section className="max-w-3xl mx-auto px-6 pt-24 pb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5 text-white leading-tight">
          {t("New Galaxy", "New Galaxy")}
        </h2>
        <p className="text-lg text-[#A0A0A0] max-w-2xl mx-auto mb-12 leading-relaxed">
          {t(
            "Огляд відібраних бібліотек з документацією та прикладами коду українською та англійською мовами.",
            "Explore selected libraries with documentation and code examples in both Ukrainian and English."
          )}
        </p>

        {/* Minimalist semantic search — white bottom border */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A0A0A0]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("Пошук бібліотек...", "Search libraries...")}
            className="w-full bg-transparent border-0 border-b-2 border-[#333333] focus:border-white pl-8 pr-9 py-3 text-base text-white placeholder:text-[#666666] focus:outline-none transition-colors"
          />
          {semanticLoading && (
            <Sparkles className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 text-white animate-pulse" />
          )}
        </div>
        {semanticLoading && (
          <p className="mt-3 text-xs text-[#A0A0A0]">
            {t("Семантичний пошук...", "Semantic search...")}
          </p>
        )}
      </section>

      {/* Cards Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-28">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-52 rounded-xl border border-[#333333] bg-[#1a1a1a] animate-pulse"
              />
            ))}
          </div>
        ) : !Array.isArray(displayed) || displayed.length === 0 ? ( // ЗАХИСТ 4: Перевірка перед малюванням
          <div className="text-center py-24 text-[#A0A0A0]">
            {t("Бібліотек не знайдено або сталася помилка з'єднання", "No libraries found or connection error")}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.map((card) => (
              <LibraryCardView key={card.id || card.slug || Math.random()} card={card} /> // Додано fallback для ключа
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
