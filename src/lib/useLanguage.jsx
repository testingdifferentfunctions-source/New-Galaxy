import React, { createContext, useContext, useState, useCallback } from "react";

const LanguageContext = createContext({
  language: "uk",
  setLanguage: () => {},
  toggle: () => {},
  t: (uk, en) => uk,
});

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("uk");

  const toggle = useCallback(() => {
    setLanguage((prev) => (prev === "uk" ? "en" : "uk"));
  }, []);

  const t = useCallback(
    (uk, en) => (language === "uk" ? uk : en),
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}