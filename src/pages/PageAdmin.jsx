import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/lib/useLanguage";
import LibraryCardForm from "@/components/admin/LibraryCardForm";

export default function AdminPanel() {
  const { t } = useLanguage();
  const [me, setMe] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [cards, setCards] = useState([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [view, setView] = useState("list"); // list | form
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Auth + admin check
  useEffect(() => {
    base44.auth
      .me()
      .then((user) => {
        setMe(user);
        setLoadingAuth(false);
      })
      .catch(() => {
        setLoadingAuth(false);
      });
  }, []);

  const loadCards = () => {
    setLoadingCards(true);
    base44.entities.LibraryCard
      .list("-created_date")
      .then((data) => {
        setCards(data);
        setLoadingCards(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load libraries");
        setLoadingCards(false);
      });
  };

  useEffect(() => {
    if (me && me.role === "admin") loadCards();
  }, [me]);

  const handleSave = async (data) => {
    setSaving(true);
    setError(null);
    try {
      if (editing) {
        await base44.entities.LibraryCard.update(editing.id, data);
      } else {
        await base44.entities.LibraryCard.create(data);
      }
      setSaving(false);
      setView("list");
      setEditing(null);
      loadCards();
    } catch (err) {
      setError(err.message || "Failed to save library");
      setSaving(false);
    }
  };

  const handleDelete = async (card) => {
    if (!confirm(`Delete "${card.title_en}"? This cannot be undone.`)) return;
    try {
      await base44.entities.LibraryCard.delete(card.id);
      loadCards();
    } catch (err) {
      setError(err.message || "Failed to delete library");
    }
  };

  // Loading auth
  if (loadingAuth) {
    return (
      <div className="dark min-h-screen flex items-center justify-center bg-background text-[#E0E0E0]">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Not admin
  if (!me || me.role !== "admin") {
    return (
      <div className="dark min-h-screen flex flex-col items-center justify-center bg-background gap-3 text-center px-6 text-[#E0E0E0]">
        <ShieldCheck className="w-12 h-12 text-[#A0A0A0]/40" />
        <h1 className="text-xl font-heading font-semibold">
          {t("Доступ заборонено", "Access denied")}
        </h1>
        <p className="text-sm text-[#A0A0A0] max-w-sm">
          {t(
            "Ця сторінка доступна лише адміністраторам.",
            "This page is restricted to administrators only."
          )}
        </p>
        <Link
          to="/"
          className="text-primary underline text-sm mt-2 inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {t("На головну", "Back to home")}
        </Link>
      </div>
    );
  }

  // Form view
  if (view === "form") {
    return (
      <div className="dark min-h-screen bg-background text-[#E0E0E0]">
        <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => {
                setView("list");
                setEditing(null);
              }}
              className="flex items-center gap-2 text-sm font-medium text-[#A0A0A0] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("Скасувати", "Cancel")}
            </button>
            <h1 className="text-base font-heading font-semibold">
              {editing
                ? t("Редагувати бібліотеку", "Edit library")
                : t("Нова бібліотека", "New library")}
            </h1>
            <div className="w-20" />
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-6 py-8">
          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <LibraryCardForm
            initialCard={editing}
            onSave={handleSave}
            onCancel={() => {
              setView("list");
              setEditing(null);
            }}
            saving={saving}
          />
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="dark min-h-screen bg-background text-[#E0E0E0]">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-heading font-semibold tracking-tight leading-none">
                {t("Адмін-панель", "Admin Panel")}
              </h1>
              <p className="text-xs text-[#A0A0A0] mt-0.5">
                {t("Керування бібліотеками", "Manage libraries")}
              </p>
            </div>
          </div>
          <Link
            to="/"
            className="text-sm text-[#A0A0A0] hover:text-white transition-colors"
          >
            {t("Переглянути сайт", "View site")} →
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-bold tracking-tight">
            {t("Бібліотеки", "Libraries")}{" "}
            <span className="text-[#A0A0A0] font-normal text-base">
              ({cards.length})
            </span>
          </h2>
          <button
            onClick={() => {
              setEditing(null);
              setView("form");
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            {t("Додати бібліотеку", "Add library")}
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {loadingCards ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-20 rounded-xl border border-border bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center py-16 text-[#A0A0A0]">
            {t("Поки що немає бібліотек", "No libraries yet")}
          </div>
        ) : (
          <div className="space-y-3">
            {cards.map((card) => (
              <div
                key={card.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white truncate">
                      {card.title_en}
                    </h3>
                    <code className="text-xs text-[#A0A0A0] bg-muted px-1.5 py-0.5 rounded">
                      {card.slug}
                    </code>
                  </div>
                  <p className="text-sm text-[#A0A0A0] line-clamp-1">
                    {card.description_en}
                  </p>
                  {card.tags && card.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {card.tags.slice(0, 5).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-[#A0A0A0] bg-muted px-1.5 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      setEditing(card);
                      setView("form");
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white text-black border border-white px-3 py-1.5 text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    {t("Редагувати", "Edit")}
                  </button>
                  <button
                    onClick={() => handleDelete(card)}
                    className="inline-flex items-center justify-center rounded-lg border border-border p-2 text-[#A0A0A0] hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}