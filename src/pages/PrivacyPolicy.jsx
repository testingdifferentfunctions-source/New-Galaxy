import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/useLanguage";
import LanguageToggle from "@/components/LanguageToggle";

export default function PrivacyPolicy() {
  const { t } = useLanguage();
  const sections = [
    {
      heading: t("Збір даних", "Data collection"),
      body: t(
        "New Galaxy не збирає персональні дані відвідувачів. Перегляд каталогу бібліотек не вимагає реєстрації та не зберігає інформацію про вас.",
        "New Galaxy does not collect personal data from visitors. Browsing the library catalog does not require registration and stores no information about you."
      ),
    },
    {
      heading: t("Файли cookie", "Cookies"),
      body: t(
        "Сайт використовує лише технічні файли cookie, необхідні для коректної роботи мовного перемикача та базової функціональності.",
        "The site uses only technical cookies required for the language switcher and basic functionality to work correctly."
      ),
    },
    {
      heading: t("Адміністрування", "Administration"),
      body: t(
        "Доступ до редагування каталогу обмежено адміністраторами. Дані бібліотекних карток зберігаються на захищеній платформі Base44.",
        "Catalog editing is restricted to administrators. Library card data is stored on the secure Base44 platform."
      ),
    },
    {
      heading: t("Контакти", "Contact"),
      body: t(
        "З питань щодо конфіденційності звертайтеся до адміністратора сайту.",
        "For privacy inquiries, contact the site administrator."
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#121212] text-[#E0E0E0]">
      <header className="sticky top-0 z-10 border-b border-[#333333] bg-[#121212]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium text-[#A0A0A0] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("На головну", "Back to home")}
          </Link>
          <LanguageToggle />
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-10">
          {t("Політика конфіденційності", "Privacy Policy")}
        </h1>
        <div className="space-y-8">
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="text-xl font-semibold text-white mb-3 mt-8">
                {s.heading}
              </h2>
              <p className="text-[#C0C0C0] leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}