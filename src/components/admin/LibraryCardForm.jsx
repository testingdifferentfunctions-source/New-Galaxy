import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import BlockEditor from "@/components/admin/BlockEditor";
import TagsInput from "@/components/admin/TagsInput";

export default function LibraryCardForm({
  initialCard,
  onSave,
  onCancel,
  saving,
}) {
  const [form, setForm] = useState({
    slug: initialCard?.slug || "",
    title_uk: initialCard?.title_uk || "",
    title_en: initialCard?.title_en || "",
    description_uk: initialCard?.description_uk || "",
    description_en: initialCard?.description_en || "",
    tags: initialCard?.tags || [],
    official_url: initialCard?.official_url || "",
    pypi_url: initialCard?.pypi_url || "",
    content_uk: initialCard?.content_uk || [],
    content_en: initialCard?.content_en || [],
  });

  const [error, setError] = useState(null);

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!form.slug.trim()) {
      setError("Slug is required.");
      return;
    }
    if (!form.title_uk.trim() || !form.title_en.trim()) {
      setError("Both Ukrainian and English titles are required.");
      return;
    }
    if (!form.official_url.trim()) {
      setError("Official URL is required.");
      return;
    }

    onSave({
      ...form,
      slug: form.slug.trim(),
      content_uk: form.content_uk,
      content_en: form.content_en,
    });
  };

  const inputClass =
    "w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Shared fields */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          General
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={form.slug}
              onChange={(e) => setField("slug", e.target.value)}
              placeholder="numpy"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="official_url">Official URL</Label>
            <Input
              id="official_url"
              value={form.official_url}
              onChange={(e) => setField("official_url", e.target.value)}
              placeholder="https://numpy.org"
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="pypi_url">PyPI URL</Label>
          <Input
            id="pypi_url"
            value={form.pypi_url}
            onChange={(e) => setField("pypi_url", e.target.value)}
            placeholder="https://pypi.org/project/aiogram/"
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tags">Tags</Label>
          <TagsInput
            value={form.tags}
            onChange={(tags) => setField("tags", tags)}
          />
        </div>
      </div>

      {/* Language tabs */}
      <div className="rounded-xl border border-border bg-card">
        <Tabs defaultValue="uk" className="w-full">
          <div className="border-b border-border px-2 pt-2">
            <TabsList className="bg-muted">
              <TabsTrigger value="uk">🇺🇦 Ukrainian</TabsTrigger>
              <TabsTrigger value="en">🇬🇧 English</TabsTrigger>
            </TabsList>
          </div>

          {/* Ukrainian tab */}
          <TabsContent value="uk" className="p-5 mt-0 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title_uk">Title (Ukrainian)</Label>
              <Input
                id="title_uk"
                value={form.title_uk}
                onChange={(e) => setField("title_uk", e.target.value)}
                placeholder="Назва бібліотеки"
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description_uk">
                Description (Ukrainian){" "}
                <span className="text-muted-foreground font-normal">
                  (max 255 chars)
                </span>
              </Label>
              <Textarea
                id="description_uk"
                value={form.description_uk}
                onChange={(e) => setField("description_uk", e.target.value)}
                maxLength={255}
                rows={2}
                placeholder="Короткий опис бібліотеки..."
                className={inputClass + " resize-y"}
              />
              <p className="text-xs text-muted-foreground text-right">
                {(form.description_uk || "").length}/255
              </p>
            </div>

            <div className="space-y-1.5">
              <Label>Content (Ukrainian)</Label>
              <BlockEditor
                blocks={form.content_uk}
                onChange={(blocks) => setField("content_uk", blocks)}
              />
            </div>
          </TabsContent>

          {/* English tab */}
          <TabsContent value="en" className="p-5 mt-0 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title_en">Title (English)</Label>
              <Input
                id="title_en"
                value={form.title_en}
                onChange={(e) => setField("title_en", e.target.value)}
                placeholder="Library title"
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description_en">
                Description (English){" "}
                <span className="text-muted-foreground font-normal">
                  (max 255 chars)
                </span>
              </Label>
              <Textarea
                id="description_en"
                value={form.description_en}
                onChange={(e) => setField("description_en", e.target.value)}
                maxLength={255}
                rows={2}
                placeholder="Short library description..."
                className={inputClass + " resize-y"}
              />
              <p className="text-xs text-muted-foreground text-right">
                {(form.description_en || "").length}/255
              </p>
            </div>

            <div className="space-y-1.5">
              <Label>Content (English)</Label>
              <BlockEditor
                blocks={form.content_en}
                onChange={(blocks) => setField("content_en", blocks)}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Error + actions */}
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : initialCard ? "Update library" : "Create library"}
        </Button>
      </div>
    </form>
  );
}